import { Button, type TableColumnProps } from "@arco-design/web-react";
import { type CertConfig } from "@/common/interface";
import { openCertModal } from "./openCertModal";
import dayjs from "dayjs";

export const useColumns = (
  mutable: (fn: (s?: CertConfig[]) => CertConfig[] | undefined) => void
): TableColumnProps[] => [
  {
    title: "#",
    dataIndex: "id",
    width: 125,
  },
  {
    title: "类型",
    dataIndex: "type",
    width: 100,
  },
  {
    title: "名称",
    dataIndex: "name",
    width: 200,
  },
  {
    title: "域名",
    dataIndex: "domain",
    width: 200,
  },
  {
    title: "有效期至",
    dataIndex: "expiredAt",
    width: 150,
    render(col: number) {
      return dayjs(col).format("YYYY-MM-DD");
    },
  },
  {
    title: "操作",
    width: 150,
    dataIndex: "cmd",
    render(_, s: CertConfig) {
      return (
        <div className="flex gap-2 items-center select-none">
          <Button
            onClick={() => {
              void openCertModal({ certConfig: s }).then(({ certConfig }) => {
                if (certConfig) {
                  mutable((s1) =>
                    s1?.map((s2) => (s2.id === s.id ? certConfig : s2))
                  );
                } else {
                  mutable((s1) => s1?.filter((s2) => s2.id !== s.id));
                }
              });
            }}
          >
            编辑
          </Button>
        </div>
      );
    },
  },
];
