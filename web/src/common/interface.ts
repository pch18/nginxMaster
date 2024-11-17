export interface ServerConfig {
  /** TimeId */
  id: string;
  /** 是否启用 */
  enabled: boolean;
  /** 备注 */
  remark: string;
  /** nginx 额外配置，加入在 location 之前 */
  nginxRaw: string;
  /** 创建时间 */
  createdAt: number;
  /** 修改时间 */
  updateAt: number;

  /** 站点域名 */
  domains: string[];

  /** 开启 httpEn */
  httpEn: boolean;
  /** http 的监听端口 */
  httpPorts: number[];

  /** 开启 ssl */
  sslEn: boolean;
  /** ssl 的监听端口 */
  sslPorts: number[];
  /** 使用哪个证书 */
  sslCertId: string;
  /** 证书 Pem Path */
  sslCertPem: string;
  /** 证书 Key Path */
  sslCertKey: string;
  /** 开启 http2 */
  sslHttp2En: boolean;
  /** 开启 http 跳转 https */
  sslForceEn: boolean;

  /** 缓存静态文件 */
  staticCacheEn: boolean;
  /** 记录日志 */
  accessLogOff: boolean;
  /** 具体路由 */
  locations: LocationConfig[];
}

export interface LocationConfig {
  /** TimeId */
  id: string;
  /** 路由路径 */
  path: string;
  /** nginx 额外配置，加在最后 */
  nginxRaw: string;

  /** 路由类型 */
  mode: LocationMode;

  proxy_target: string;
  proxy_wsEn: boolean;
  proxy_host: string;

  static_root: string;
  static_indexEn: boolean;
  static_index: string;
  static_spaEn: boolean;
  static_spa: string;

  redirect_target: string;
  redirect_code: LocationRedirectCode;
  redirect_takeUri: boolean;
}

export enum LocationRedirectCode {
  Code301 = "301",
  Code302 = "302",
  Code307 = "307",
  Code308 = "308",
}

export enum LocationMode {
  Proxy = "proxy",
  Static = "static",
  Redirect = "redirect",
  Custom = "custom",
}

export interface CertConfig {
  id: string;
  type: CertType;

  /** 自定义的名称 */
  name: string;
  /** 适用域名 */
  domain: string;
  /** 颁发者 */
  issuer: string;
  /** 生效时间 */
  effectAt: number;
  /** 过期时间 */
  expiredAt: number;

  pemRaw: string;
  keyRaw: string;
  pemPath: string;
  keyPath: string;
}

export enum CertType {
  Custom = "custom",
}
