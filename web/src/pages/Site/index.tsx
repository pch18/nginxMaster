import { Button, Input, Table } from "@arco-design/web-react";
import { openSiteModal } from "./openSiteModal";
import { useColumns } from "./useColumns";
import { useSiteList } from "@/common/useList";
import { useMemo, useState } from "react";

export default function () {
  const { sortedList, loading, error, mutate } = useSiteList();

  const columns = useColumns(mutate);

  const [siteSearch, setSiteSearch] = useState("");
  const filteredList = useMemo(() => {
    if (!siteSearch) return sortedList;
    const lowerSiteSearch = siteSearch.trim().toLowerCase();

    return sortedList.filter(
      (li) =>
        li.domains.some((l) => l.toLowerCase().includes(lowerSiteSearch)) ||
        li.id.includes(siteSearch)
    );
  }, [sortedList, siteSearch]);

  return (
    <div className="p-4">
      <div className="mb-3 flex gap-4 items-center">
        <Button
          onClick={async () => {
            const { serverConfig } = await openSiteModal({ title: "新建站点" });
            if (serverConfig) {
              mutate((s) => [...(s ?? []), serverConfig]);
            }
          }}
        >
          新建站点
        </Button>
        <Input
          className="!w-40"
          placeholder="检索站点"
          allowClear
          value={siteSearch}
          onChange={setSiteSearch}
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
