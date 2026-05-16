import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class QueryParamsService {
  readonly #router = inject(Router);
  readonly #route = inject(ActivatedRoute);

  /**
   * Updates query parameters in the URL based on the provided parameters.
   * If a key is specified, updates only the parameters under that key (e.g., 'filters', 'pagination').
   * Sets parameters for non-null/undefined values and removes parameters for null/undefined values.
   * @param params Object containing parameter values
   * @param key Optional key to update specific parameters
   * @param replaceUrl Whether to replace the current history entry (default: false)
   */
  updateQueryParams(params: Record<string, any>, key?: string, replaceUrl = false): void {
    let queryParams: Record<string, any>;

    if (key) {
      const currentParams = this.#unflattenParams(this.#route.snapshot.queryParams);
      currentParams[key] = { ...currentParams[key], ...params };
      queryParams = this.buildQueryParams(currentParams);
    }
    else
      queryParams = this.buildQueryParams(params);

    const currentPath = this.#router.url.split('?')[0];
    this.#router.navigate([currentPath], {
      queryParams,
      queryParamsHandling: 'merge',
      replaceUrl,
    });
  }

  /**
   * Retrieves current query parameters from the URL as a structured object.
   * @returns Observable of the query parameters as a nested object
   */
  getQueryParams(): Observable<Record<string, any>> {
    return this.#route.queryParams.pipe(map(params => this.#unflattenParams(params)));
  }

  /**
   * Retrieves a subset of query parameters for a specific key.
   * @param key The key to extract (e.g., 'filters', 'pagination')
   * @returns Observable containing the parameters for the specified key
   */
  getQueryParamsByKey(key: string): Observable<any> {
    return this.getQueryParams().pipe(map(params => params[key] || {}));
  }

  /**
   * Synchronously parses query parameters from a provided query params object.
   * @param queryParams Flat query parameters object (e.g., route.snapshot.queryParams)
   * @param key Optional key to extract specific parameters
   * @returns Nested object for the specified key or entire params if no key provided
   */
  parseQueryParams(queryParams: Record<string, string | string[]>, key?: string): any {
    const parsedParams = this.#unflattenParams(queryParams);
    return key ? parsedParams[key] || {} : parsedParams;
  }

  /**
   * Flattens a nested object into a flat key-value map with dot notation.
   * Converts arrays to comma-separated strings with '[]' suffix, Dates to ISO strings, and marks null/undefined as null.
   */
  buildQueryParams(obj: any, prefix = ''): Record<string, any> {
    const result: Record<string, any> = {};

    const appendParams = (obj: any, currentPrefix: string): void => {
      Object.entries(obj).forEach(([key, value]) => {
        const isArray = Array.isArray(value);
        const paramKey = currentPrefix ? `${currentPrefix}.${key}${isArray ? '[]' : ''}` : `${key}${isArray ? '[]' : ''}`;

        if (value === null || value === undefined) {
          result[paramKey] = null;
          return;
        }

        if (isArray) {
          if (value.length > 0) {
            const isObjectArray = value.every(item => typeof item === 'object' && item !== null && !(item instanceof Date));
            result[paramKey] = isObjectArray ? JSON.stringify(value) : value.map(item => String(item)).join(',');
          }
          else
            result[paramKey] = null;
          return;
        }

        if (typeof value === 'object' && !(value instanceof Date))
          appendParams(value, paramKey);
        else {
          const paramValue = value instanceof Date ? value.toISOString() : String(value);
          result[paramKey] = paramValue;
        }
      });
    };

    appendParams(obj, prefix);
    return result;
  }

  #unflattenParams(flatParams: Record<string, string | string[]>): Record<string, any> {
    const result: Record<string, any> = {};

    for (const [key, value] of Object.entries(flatParams)) {
      if (value === null || value === undefined)
        continue;

      const keys = key.replace(/\[\]$/, '').split('.');
      let current = result;

      for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i];
        current[k] = current[k] || {};
        current = current[k];
      }

      const finalKey = keys[keys.length - 1];
      let finalValue: any = value;

      const isArrayKey = key.endsWith('[]');

      if (isArrayKey && typeof value === 'string') 
        finalValue = value.includes(',') ? value.split(',').filter(v => v) : [value];

      else if (typeof value === 'string' && value.startsWith('[') && value.endsWith(']')) {
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed))
            finalValue = parsed;
        }
        catch (e) {
          console.error('JSON parsing failed!', e);
          finalValue = value;
        }
      }
      else if (value === 'true')
        finalValue = true;

      else if (value === 'false')
        finalValue = false;

      else if (typeof value === 'string' && /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.*Z/.test(value)) {
        const date = new Date(value);
        if (!isNaN(date.getTime()))
          finalValue = date;
      }

      if (isArrayKey && !Array.isArray(finalValue))
        finalValue = [finalValue];

      current[finalKey] = finalValue;
    }

    return result;
  }
}
