import { type ServerConfig } from "@/common/interface";

const baseUrl = "/api/v1";

const customFetch = async <T>(url: string, param?: any) => {
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(param),
  });

  if (res.status !== 200) throw new Error(`${res.status} ${res.statusText}`);

  return (await res.json()) as T;
};

export const request = {
  ListSiteList: async () => {
    return await customFetch<{ list: ServerConfig[] }>(
      `${baseUrl}/list_site_list`
    );
  },

  VerifySite: async (nginxConfig: string) => {
    return await customFetch<{ err: string; output?: string }>(
      `${baseUrl}/verify_site`,
      { nginxConfig }
    );
  },

  SaveSite: async (
    id: string,
    serverConfig: ServerConfig | null,
    nginxConfig: string
  ) => {
    return await customFetch<{ err: string; output?: string }>(
      `${baseUrl}/save_site`,
      {
        id,
        serverConfig,
        nginxConfig,
      }
    );
  },

  SetPass: async (name: string, pass: string) => {
    return await customFetch<{ err: string }>(`${baseUrl}/set_pass`, {
      name,
      pass,
    });
  },
};
