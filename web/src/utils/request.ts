import { type CertConfig, type ServerConfig } from "@/common/interface";
import { Message } from "@arco-design/web-react";

const baseUrl = "/api/v1";

const customFetch = async <T>(
  url: string,
  param?: any,
  other?: RequestInit
) => {
  let res: Response | undefined;
  try {
    res = await fetch(url, {
      ...other,
      method: "POST",
      body: JSON.stringify(param),
    });
  } catch {}
  if (!res) {
    Message.error("网络错误");
    throw new Error("网络错误");
  }

  if (res.status === 401) location.href = "/login";
  if (res.status !== 200) {
    Message.error(`${res.status} ${res.statusText}`);
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return (await res.json()) as T;
};

export const request = {
  ListSite: async () => {
    return await customFetch<{ list: ServerConfig[] }>(`${baseUrl}/list_site`);
  },

  VerifySite: async (nginxConfig: string) => {
    return await customFetch<{ err?: string; output: string }>(
      `${baseUrl}/verify_site`,
      { nginxConfig }
    );
  },

  SaveSite: async (
    id: string,
    serverConfig: ServerConfig | null,
    nginxConfig: string
  ) => {
    return await customFetch<{ err?: string; output: string }>(
      `${baseUrl}/save_site`,
      {
        id,
        serverConfig,
        nginxConfig,
      }
    );
  },

  ListCert: async (full = false) => {
    return await customFetch<{ list: CertConfig[] }>(`${baseUrl}/list_cert`, {
      full,
    });
  },

  SaveCert: async (c: CertConfig) => {
    return await customFetch<{
      err?: string;
      output: string;
      certConfig: CertConfig;
    }>(`${baseUrl}/save_cert`, c);
  },

  DelCert: async (id: string) => {
    return await customFetch<{ err?: string; output: string }>(
      `${baseUrl}/del_cert`,
      { id }
    );
  },

  SetAuth: async (oldAuth: string, newAuth: string) => {
    return await customFetch<{ err?: string }>(`${baseUrl}/set_auth`, {
      oldAuth,
      newAuth,
    });
  },

  Login: async (auth: string) => {
    return await customFetch<{ err?: string }>(`${baseUrl}/login`, { auth });
  },

  Logout: async () => {
    return await customFetch<{ err?: string }>(`${baseUrl}/logout`, {});
  },

  nginxStatus: async () => {
    return await customFetch<{ ok: boolean; err?: string }>(
      `${baseUrl}/nginx_status`,
      {}
    );
  },

  nginxStart: async () => {
    return await customFetch<{ err?: string; output: string }>(
      `${baseUrl}/nginx_start`,
      {}
    );
  },

  nginxReload: async () => {
    return await customFetch<{ err?: string; output: string }>(
      `${baseUrl}/nginx_reload`,
      {}
    );
  },

  nginxLogs: (lineCount: number) => {
    const sse = new EventSource(`${baseUrl}/nginx_logs?n=${lineCount}`);
    return sse;
  },

  getSys: async (time: number) => {
    return await customFetch<{
      list: SysInfo[];
      total: number;
      interval: number;
    }>(`${baseUrl}/get_sys`, {
      time,
    });
  },
};

export interface SysInfo {
  t: number;
  c: number;
  mu: number;
  mt: number;
  ns: number;
  nr: number;
}
