export class IAPISettings {
  http_server: boolean;  
  http_ip: string;
  http_port: number;

  https_server: boolean;
  https_ip: string;
  https_port: number;
  https_key: string;
  https_cert: string;

  app_folder: string;

  show_sql: boolean;

  use_cors: boolean;
  whitelist: string|string[];

  bodyparserJson: any;
  bodyparserUrlencoded: any;
  bodyparserText: any;

  jade: boolean;
  jade_views: string;

  logger: string;

  compression: boolean;

  rbac: boolean;
  rbacDefinition: any;

  cookies: boolean;
  csurf: boolean;

  unauthorizedError: string;
}
