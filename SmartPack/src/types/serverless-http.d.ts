// Type declaration for serverless-http
declare module 'serverless-http' {
  import { Application } from 'express';

  interface ServerlessOptions {
    binary?: boolean | string[];
    provider?: string;
    basePath?: string;
    stage?: string;
    request?: Record<string, unknown>;
    response?: Record<string, unknown>;
  }

  function serverless(
    app: Application,
    options?: ServerlessOptions
  ): (event: Record<string, unknown>, context: Record<string, unknown>) => Promise<Record<string, unknown>>;

  export = serverless;
}
