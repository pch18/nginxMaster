import {
  type LocationConfig,
  LocationMode,
  LocationRedirectCode,
  type ServerConfig,
  type CertConfig,
  CertType,
} from "./interface";

export const newServerConfig = (): ServerConfig => {
  return {
    id: makeId(),
    enabled: true,
    remark: "",
    nginxRaw: "",
    createdAt: Date.now(),
    updateAt: Date.now(),

    domains: [],

    httpEn: true,
    httpPorts: [80],

    sslEn: false,
    sslPorts: [443],
    sslCertId: "",
    sslCertPem: "",
    sslCertKey: "",
    sslHttp2En: true,
    sslForceEn: false,

    staticCacheEn: false,
    accessLogOff: false,
    locations: [newLocationConfig()],
  };
};

export const newLocationConfig = (): LocationConfig => {
  return {
    id: makeId(),
    path: "/",
    nginxRaw: "",

    mode: LocationMode.Proxy,

    proxy_target: "http://0.0.0.0",
    proxy_wsEn: false,
    proxy_host: "$host",

    static_root: "/app",
    static_indexEn: false,
    static_index: "index.html",
    static_spaEn: false,
    static_spa: "/index.html",

    redirect_target: "http://example.com",
    redirect_takeUri: false,
    redirect_code: LocationRedirectCode.Code302,
  };
};

export const newCertConfig = (): CertConfig => {
  return {
    id: makeId(),
    type: CertType.Custom,
    name: "",

    domain: "",
    issuer: "",
    effectAt: -1,
    expiredAt: -1,

    pemRaw: "",
    keyRaw: "",
    pemPath: "",
    keyPath: "",
  };
};

export const makeId = () =>
  (
    (Date.now() - 1600000000000) * 10000 +
    Math.floor(Math.random() * 10000)
  ).toString(36);
