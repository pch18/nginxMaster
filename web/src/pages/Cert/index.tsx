import { Button, Table } from "@arco-design/web-react";
import { useColumns } from "./useColumns";
import { openCertModal } from "./openCertModal";
import { useCertList } from "@/common/useList";

export default function () {
  const { sortedList, loading, error, mutate } = useCertList();

  const columns = useColumns(mutate);

  return (
    <div className="p-4">
      <div className="mb-3">
        <Button
          onClick={async () => {
            const { certConfig } = await openCertModal({});
            if (certConfig) {
              mutate((s) => [...(s ?? []), certConfig]);
            }
          }}
        >
          新建证书
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
