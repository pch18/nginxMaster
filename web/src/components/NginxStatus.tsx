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
    return <Spin loading={loading} className="ml-5 h-5 overflow-hidden" />;
  }

  return (
    <div className="h-5 overflow-hidden">
      {data?.ok ? (
        <Tag color="green" size="small" className="ml-2">
          运行中
        </Tag>
      ) : data?.err ? (
        <Tag color="orange" size="small" className="ml-2">
          异常
        </Tag>
      ) : (
        <>
          <Tag color="red" size="small" className="ml-2">
            停止
          </Tag>
          <AsyncButton
            size="mini"
            type="text"
            className="!py-0 !px-2 !h-full"
            onClick={async () => {
              const res = await request.nginxStart();
              if (res.err) {
                actionNotification(res.err, res.output);
              } else {
                await refreshAsync();
              }
            }}
          >
            立即启动
          </AsyncButton>
        </>
      )}
    </div>
  );
};
