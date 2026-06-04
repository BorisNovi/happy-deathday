import { HttpInterceptorFn } from "@angular/common/http";
import { inject, InjectionToken } from "@angular/core";

export const SSR_API_BASE = new InjectionToken<string>('SSR_API_BASE', { factory: () => '' });

export const ssrApiInterceptor: HttpInterceptorFn = (req, next) => {
  const base = inject(SSR_API_BASE);
  if (base && req.url.startsWith('/api')) {
    return next(req.clone({ url: `${base}${req.url}` }));
  }
  return next(req);
};
