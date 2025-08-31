import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((err: unknown) => {
      if (!(err instanceof HttpErrorResponse)) {
        return throwError(() => new Error('Network error. Please check your connection.'));
      }

      const { status, error, url } = err;

      const serverMsg =
        (typeof error === 'string' && error) ||
        (error?.message as string) ||
        (error?.cod && `${error.cod}: ${error.message}`) ||
        '';

      let friendly = 'Unexpected error. Please try again.';

      if (status === 0) {
        friendly = 'Cannot reach the server. Check your network or try again later.';
      } else if (status >= 500) {
        friendly = 'Service is temporarily unavailable. Please try again later.';
      } else if (status === 404) {
        friendly = 'City not found. Try a different name.';
      } else if (status === 401 || status === 403) {
        friendly = 'Invalid or inactive API key. Please verify your OpenWeather key.';
      } else if (status === 400) {
        friendly = 'Bad request. Please adjust your input and try again.';
      } else if (serverMsg) {
        friendly = serverMsg;
      }

      if (!friendly && url) {
        friendly = `Request failed (${status}) for ${url}`;
      }

      return throwError(() => new Error(friendly));
    })
  );
};
