import { useSiteList } from "@/common/useList";
import { useNginxLog } from "@/common/useNginxLogs";
import { Button, Form, Input, Select } from "@arco-design/web-react";
import { type FC, useMemo } from "react";

export const LogsTitle: FC<{ className?: string }> = ({ className = "" }) => {
  const { data } = useSiteList();
  const { onSearchFormChange, searchForm, logs } = useNginxLog();

  const siteOptions = useMemo(() => {
    const optionsSet = new Set<string>();
    data?.forEach((site) => {
      site.domains.forEach((domain) => {
        optionsSet.add(domain);
      });
    });
    return [...optionsSet.values()].map((d) => ({ label: d, value: d }));
  }, [data]);

  return (
    <>
      <div className="flex-none font-bold text-lg mb-2">
        实时日志 ({logs.length})
      </div>
      <Form
        form={searchForm}
        onChange={(_, v) => {
          onSearchFormChange(v);
        }}
        autoComplete="new-password"
        layout="inline"
        className={`!flex-nowrap ${className}`}
        size="mini"
        css={`
          .arco-input-tag-inner {
            flex-wrap: nowrap;
          }
          .arco-form-label-item {
            flex: none;
          }
          .arco-form-item-wrapper {
            flex: auto;
          }
        `}
      >
        <Form.Item label="域名" field="hosts" className="flex-[2]">
          <Select
            options={siteOptions}
            mode="multiple"
            allowCreate
            allowClear
            maxTagCount={"responsive"}
            triggerProps={{
              autoAlignPopupWidth: false,
              autoAlignPopupMinWidth: true,
            }}
          />
        </Form.Item>
        <Form.Item label="方式" field="method" className="!w-[120px]">
          <Select
            options={methodOptions}
            allowCreate
            allowClear
            triggerProps={{
              autoAlignPopupWidth: false,
              autoAlignPopupMinWidth: true,
            }}
          />
        </Form.Item>
        <Form.Item label="状态码" field="status" className="!w-[100px]">
          <Input maxLength={4} />
        </Form.Item>
        <Form.Item label="来源IP" field="fromIP" className="!w-[150px]">
          <Input />
        </Form.Item>
        <Form.Item
          label="Ref/UA"
          field="ref_ua"
          className="flex-[1] min-w-[120px]"
        >
          <Input />
        </Form.Item>
        <Button
          onClick={() => {
            searchForm.resetFields();
            onSearchFormChange({});
          }}
        >
          重置
        </Button>
      </Form>
    </>
  );
};

const methodOptions = [
  {
    label: "GET",
    value: "GET",
  },
  {
    label: "POST",
    value: "POST",
  },
  {
    label: "PUT",
    value: "PUT",
  },
  {
    label: "PATCH",
    value: "PATCH",
  },
  {
    label: "DELETE",
    value: "DELETE",
  },
  {
    label: "HEAD",
    value: "HEAD",
  },
  {
    label: "OPTIONS",
    value: "OPTIONS",
  },
];
