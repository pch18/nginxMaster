import { Button, Link, type TableColumnProps } from "@arco-design/web-react";
import { handleNotification, openSiteModal } from "./openSiteModal";
import { type LocationConfig, type ServerConfig } from "@/common/interface";
import { LocationTitle } from "@/common/LocationTitle";
import { AsyncSwitch } from "@/components/AsyncSwitch";
import { makeNginxServerConfig } from "@/common/makeNginxConfig";
import { request } from "@/utils/request";

export const useColumns = (
  mutable: (fn: (s?: ServerConfig[]) => ServerConfig[] | undefined) => void
): TableColumnProps[] => [
  {
    title: "#",
    dataIndex: "id",
    width: 125,
  },
  {
    title: "域名",
    dataIndex: "domains",
    width: 200,
    render(domains: string[], s: ServerConfig) {
      return (
        <div className="flex flex-wrap overflow-hidden">
          {domains
            .map((d) => d.trim())
            .filter((d) => d)
            .map((d, i) => (
              <Link
                key={i}
                href={
                  s.sslEn
                    ? `https://${d}:${s.sslPorts[0] ?? 443}`
                    : `http://${d}:${s.httpPorts[0] ?? 80}`
                }
                target="_blank"
              >
                {d}
              </Link>
            ))}
        </div>
      );
    },
  },
  {
    title: "证书状态",
    dataIndex: "ssl",
    width: 150,
  },
  {
    title: "服务配置",
    dataIndex: "locations",
    render(locations: LocationConfig[]) {
      return (
        <div className="flex flex-col gap-1 overflow-hidden">
          {locations.map((l) => (
            <LocationTitle location={l} key={l.id} />
          ))}
        </div>
      );
    },
  },
  {
    title: "操作",
    width: 150,
    dataIndex: "cmd",
    render(_, s: ServerConfig) {
      return (
        <div className="flex gap-2 items-center select-none">
          <AsyncSwitch
            checkedText="开启"
            uncheckedText="停用"
            className="w-14"
            checked={s.enabled}
            onChange={async (c) => {
              const newS = { ...s, enabled: c };
              const res = await request.SaveSite(
                s.id,
                newS,
                c ? makeNginxServerConfig(newS) : ""
              );
              handleNotification(res.err, res.output);
              if (!res.err) {
                mutable((s1) => s1?.map((s2) => (s2.id === s.id ? newS : s2)));
              }
            }}
          />
          <Button
            onClick={() => {
              void openSiteModal({ serverConfig: s }).then(
                ({ serverConfig }) => {
                  if (serverConfig) {
                    mutable((s1) =>
                      s1?.map((s2) => (s2.id === s.id ? serverConfig : s2))
                    );
                  } else {
                    mutable((s1) => s1?.filter((s2) => s2.id !== s.id));
                  }
                }
              );
            }}
          >
            编辑
          </Button>
        </div>
      );
    },
  },
];
