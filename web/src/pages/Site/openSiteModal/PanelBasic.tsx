import {
  Checkbox,
  Form,
  type FormInstance,
  Input,
  Select,
  Switch,
  Tag,
} from "@arco-design/web-react";
import { useMemo, type FC } from "react";
import clsx from "clsx";
import { useCertList } from "@/common/useList";
import { CertTitle } from "@/common/CertTitle";

export const PanelBasic: FC<{ className?: string; formIns: FormInstance }> = ({
  className,
  formIns,
}) => {
  const { sortedList, certMapId } = useCertList();
  const certOptions = useMemo(
    () =>
      sortedList.map((c) => ({
        label: <CertTitle certConfig={c} />,
        value: c.id,
      })),
    []
  );

  return (
    <div className={clsx(className)}>
      <Form.Item
        field="domains"
        label="域名"
        rules={[{ required: true, message: "请填写域名" }]}
        normalize={(v) => v.split("\n")}
        formatter={(v) => v.join("\n")}
        onBlur={() => {
          const f = formIns
            .getFieldValue("domains")
            .map((d: string) => d.trim())
            .filter((d: string) => d);
          formIns.setFieldValue("domains", f);
        }}
      >
        <Input.TextArea placeholder={"example.com"} autoSize={true} />
      </Form.Item>

      <Form.Item label="HTTP" shouldUpdate={(p, n) => p.httpEn !== n.httpEn}>
        {(formData) => (
          <div className="flex items-center gap-5">
            <Form.Item noStyle field="httpEn" triggerPropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item
              disabled={!formData.httpEn}
              label="端口"
              field="httpPorts"
              className="!m-0"
            >
              <Select mode="multiple" allowCreate />
            </Form.Item>
          </div>
        )}
      </Form.Item>

      <Form.Item
        label="HTTPS"
        shouldUpdate={(p, n) => p.sslEn !== n.sslEn}
        className="!m-0"
      >
        {(formData) => (
          <>
            <div className="flex items-center gap-5 mb-5">
              <Form.Item noStyle field="sslEn" triggerPropName="checked">
                <Switch />
              </Form.Item>
              <Form.Item
                disabled={!formData.sslEn}
                label="端口"
                field="sslPorts"
                className="!m-0"
              >
                <Select mode="multiple" allowCreate />
              </Form.Item>
            </div>

            {formData.sslEn && (
              <div>
                <div className="flex mb-5 gap-5">
                  <Form.Item
                    noStyle
                    field="sslHttp2En"
                    triggerPropName="checked"
                  >
                    <Checkbox>开启http2</Checkbox>
                  </Form.Item>
                  <Form.Item
                    noStyle
                    field="sslForceEn"
                    triggerPropName="checked"
                  >
                    <Checkbox>强制https</Checkbox>
                  </Form.Item>
                </div>
                <Form.Item
                  rules={[{ required: true, message: "请选择证书" }]}
                  field="sslCertId"
                  label="证书"
                >
                  <Select
                    options={certOptions}
                    onChange={(sslCertId) => {
                      formIns.setFieldsValue({
                        sslCertPem: certMapId[sslCertId]?.pemPath,
                        sslCertKey: certMapId[sslCertId]?.keyPath,
                      });
                    }}
                  />
                </Form.Item>
              </div>
            )}
          </>
        )}
      </Form.Item>

      <Form.Item label="其他">
        <div className="flex gap-2">
          <Form.Item noStyle field="staticCacheEn" triggerPropName="checked">
            <Checkbox>缓存静态文件</Checkbox>
          </Form.Item>
          <Form.Item noStyle field="accessLogOff" triggerPropName="checked">
            <Checkbox>关闭日志记录</Checkbox>
          </Form.Item>
          <Form.Item noStyle field="defaultServerEn" triggerPropName="checked">
            <Checkbox>设为默认站点</Checkbox>
          </Form.Item>
        </div>
      </Form.Item>

      <Form.Item field="nginxRaw" label="脚本">
        <Input.TextArea
          placeholder={"自定义 nginx 脚本，插入在 location块 之前"}
          autoSize={{ minRows: 2 }}
        />
      </Form.Item>

      <Form.Item field="remark" label="备注">
        <Input.TextArea placeholder={"备注记录"} autoSize={{ minRows: 2 }} />
      </Form.Item>
    </div>
  );
};
