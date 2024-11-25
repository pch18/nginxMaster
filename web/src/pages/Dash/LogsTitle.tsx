import { useNginxLog } from "@/common/useNginxLogs";
import { Button, Form, Input } from "@arco-design/web-react";
import { type FC } from "react";

export const LogsTitle: FC<{ className?: string }> = ({ className = "" }) => {
  const [form] = Form.useForm();
  const { setSearchRule, searchRule, logs } = useNginxLog();

  return (
    <>
      <div className="flex-none font-bold text-lg mb-2">
        实时日志 ({logs.length})
      </div>
      <Form
        form={form}
        onChange={(_, v) => {
          setSearchRule(v);
        }}
        initialValues={searchRule}
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
        <Form.Item label="地址" field="fullUrl" className="flex-[3]">
          <Input />
        </Form.Item>
        <Form.Item label="方式" field="method" className="flex-[1] min-w-28">
          <Input />
        </Form.Item>
        <Form.Item label="状态码" field="status" className="flex-[1] min-w-28">
          <Input maxLength={4} />
        </Form.Item>
        <Form.Item label="来源IP" field="fromIP" className="flex-[1] min-w-40">
          <Input />
        </Form.Item>
        <Form.Item label="Ref/UA" field="ref_ua" className="flex-[2] min-w-40">
          <Input />
        </Form.Item>
        <Button
          onClick={() => {
            form.clearFields();
            setSearchRule({});
          }}
        >
          重置
        </Button>
      </Form>
    </>
  );
};
