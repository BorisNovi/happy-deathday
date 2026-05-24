import { HttpParams } from '@angular/common/http';

export function buildHttpParams(source: Record<string, unknown>, params = new HttpParams(), prefix = ''): HttpParams {
  Object.entries(source || {}).forEach(([key, value]) => {
    const paramKey = prefix ? `${prefix}.${key}` : key;

    if (value === null || value === undefined)
      return;

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item === 'object' && item !== null)
          params = buildHttpParams(item as Record<string, unknown>, params, `${paramKey}[${index}]`);
        else
          params = params.append(`${paramKey}[${index}]`, String(item));
      });
    } 
    else if (typeof value === 'object' && !(value instanceof Date))
      params = buildHttpParams(value as Record<string, unknown>, params, paramKey);
    else {
      const paramValue = value instanceof Date ? value.toISOString() : String(value);
      params = params.set(paramKey, paramValue);
    }
  });

  return params;
}
