import { Button, Table } from "@arco-design/web-react";
import { openSiteModal } from "./openSiteModal";
import { useColumns } from "./useColumns";
import { useSiteList } from "@/common/useList";

export default function () {
  const { sortedList, loading, error, mutate } = useSiteList();

  const columns = useColumns(mutate);

  return (
    <div className="p-4">
      <div className="mb-3">
        <Button
          onClick={async () => {
            const { serverConfig } = await openSiteModal({});
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
        data={sortedList}
        loading={loading || Boolean(error)}
        rowKey="id"
        pagination={false}
      />
    </div>
  );
}
