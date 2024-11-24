import { request } from "@/utils/request";
import { Tag, Spin } from "@arco-design/web-react";
import { useRequest } from "ahooks";
import { AsyncButton } from "./AsyncButton";
import { actionNotification } from "@/common/actionNotification";

export const NginxStatus = () => {
  const { data, loading, refreshAsync } = useRequest(request.nginxStatus, {
    pollingInterval: 10000,
  });
  if (loading) {
    return <Spin loading={loading} className="h-5 pl-7 overflow-hidden w-36" />;
  }

  return (
    <div className="h-5 overflow-hidden w-36">
      {data?.ok ? (
        <>
          <Tag color="green" size="small" className="ml-2">
            运行中
          </Tag>
          <AsyncButton
            size="mini"
            type="text"
            className="!py-0 !px-2 !h-full"
            onClick={async () => {
              const res = await request.nginxReload();
              actionNotification(res.err, res.output);
              void refreshAsync();
            }}
          >
            重载配置
          </AsyncButton>
        </>
      ) : (
        <>
          <Tag
            color={data?.err ? "orange" : "red"}
            size="small"
            className="ml-2"
          >
            {data?.err ? "异常" : "停止"}
          </Tag>
          <AsyncButton
            size="mini"
            type="text"
            className="!py-0 !px-2 !h-full"
            onClick={async () => {
              const res = await request.nginxStart();
              actionNotification(res.err, res.output);
              void refreshAsync();
            }}
          >
            立即启动
          </AsyncButton>
        </>
      )}
    </div>
  );
};
