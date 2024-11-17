import { type CertConfig, type ServerConfig } from "@/common/interface";

const baseUrl = "/api/v1";

const customFetch = async <T>(
  url: string,
  param?: any,
  other?: RequestInit
) => {
  const res = await fetch(url, {
    ...other,
    method: "POST",
    body: JSON.stringify(param),
  });

  if (res.status !== 200) throw new Error(`${res.status} ${res.statusText}`);

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

  Logout: async () => {
    return await customFetch<{ err?: string }>(`${baseUrl}/logout`, {});
  },
};
