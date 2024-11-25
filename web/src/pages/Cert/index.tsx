import { Button, Input, Table } from "@arco-design/web-react";
import { useColumns } from "./useColumns";
import { openCertModal } from "./openCertModal";
import { useCertList } from "@/common/useList";
import { useState, useMemo } from "react";

export default function () {
  const { sortedList, loading, error, mutate } = useCertList();

  const columns = useColumns(mutate);

  const [certSearch, setCertSearch] = useState("");
  const filteredList = useMemo(() => {
    if (!certSearch) return sortedList;
    const lowerCertSearch = certSearch.trim().toLowerCase();

    return sortedList.filter(
      (li) =>
        li.name.toLowerCase().includes(lowerCertSearch) ||
        li.domain.toLowerCase().includes(lowerCertSearch) ||
        li.id.includes(lowerCertSearch)
    );
  }, [sortedList, certSearch]);

  return (
    <div className="p-4">
      <div className="mb-3 flex gap-4 items-center">
        <Button
          onClick={async () => {
            const { certConfig } = await openCertModal({ title: "新建证书" });
            if (certConfig) {
              mutate((s) => [...(s ?? []), certConfig]);
            }
          }}
        >
          新建证书
        </Button>
        <Input
          className="!w-40"
          placeholder="检索证书"
          allowClear
          value={certSearch}
          onChange={setCertSearch}
        />
        <div>共{filteredList.length}条</div>
      </div>

      <Table
        className="select-text"
        columns={columns}
        data={filteredList}
        loading={loading || Boolean(error)}
        rowKey="id"
        pagination={false}
      />
    </div>
  );
}
