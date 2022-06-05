import { combineLatest, map, Observable, take, tap } from 'rxjs';
import { SecurityService } from 'security';
import { environment as env } from 'src/environments/environment';

declare var apiLoaded: Promise<void>;
declare var gsiLoaded: Promise<void>;

async function configureApiLib(): Promise<void> {
  await apiLoaded;

  let configured: (value: void | PromiseLike<void>) => void;
  let error: (reason?: any) => void;

  gapi.load('client', () =>
    gapi.client
      .init({ apiKey: env.API_KEY, discoveryDocs: [env.DISCOVERY_DOC] })
      .then(configured)
      .catch(error)
  );

  return new Promise((resolve, reject) => {
    configured = resolve;
    error = reject;
  });
}

export function initSecurity(securityService: SecurityService): () => Promise<void> {
  return async () => {
    await gsiLoaded;
    securityService.init();
  };
}

export function initGapi(securityService: SecurityService): () => Observable<void> {
  return () =>
    combineLatest([securityService.token$, configureApiLib()]).pipe(
      tap(([token]) => gapi.client.setToken(token)),
      map(() => undefined),
      take(1)
    );
}
