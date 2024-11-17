import { Button, Table } from "@arco-design/web-react";
import { openSiteModal } from "./openSiteModal";
import { useRequest } from "ahooks";
import { newServerConfig } from "@/common/newConfig";
import { useColumns } from "./useColumns";
import { request } from "@/utils/request";

export default function () {
  const { data, loading, mutate } = useRequest(async () => {
    const { list } = await request.ListSiteList();
    list.sort((a, b) => (a.id < b.id ? 1 : -1));
    return list;
  });
  const columns = useColumns(mutate);

  return (
    <div className="p-4">
      <div className="mb-3">
        <Button
          onClick={async () => {
            const { serverConfig } = await openSiteModal({
              serverConfig: newServerConfig(),
            });
            if (serverConfig) {
              mutate((s) => [...(s ?? []), serverConfig]);
            }
          }}
        >
          新建站点
        </Button>
      </div>

      <Table
        className="select-text"
        columns={columns}
        data={data}
        loading={loading}
        rowKey="id"
        pagination={false}
      />
    </div>
  );
}
