import { type CertConfig } from "@/common/interface";
import {
  Button,
  Form,
  type FormInstance,
  Input,
  Message,
  type RulesProps,
  Select,
} from "@arco-design/web-react";
import { IconUpload } from "@arco-design/web-react/icon";
import { type FC } from "react";
import dayjs from "dayjs";
import { fileUpload } from "@/utils/fileUpload";
import {
  parseCert,
  parseCerts,
  parseMainCert,
  splitCerts,
  validateMainCert,
} from "@/utils/parseCert";

export const FormContext: FC<{
  formIns: FormInstance;
  initCertConfig: CertConfig;
}> = ({ formIns, initCertConfig }) => {
  const clearCertInfo = () => {
    formIns.setFieldsValue({
      domain: "",
      issuer: "",
      effectAt: -1,
      expiredAt: -1,
    });
  };

  const pemValidator: RulesProps["validator"] = (
    pemRaw: string | undefined,
    cb
  ) => {
    try {
      const res = parseMainCert(pemRaw || "");
      formIns.setFieldsValue({
        domain: res.sanDomains?.join(", ") ?? res.subject ?? "",
        issuer: res.issuer,
        effectAt: res.notBefore,
        expiredAt: res.notAfter,
      });
    } catch {
      clearCertInfo();
      cb("证书解析失败");
    }
  };
  const keyValidator: RulesProps["validator"] = (
    keyRaw: string | undefined,
    cb
  ) => {
    try {
      const pemRaw: string = formIns.getFieldValue("pemRaw");
      const res = validateMainCert(pemRaw, keyRaw || "");
      if (!res) {
        cb("公钥和私钥不匹配");
      }
    } catch {
      cb("证书解析失败");
    }
  };

  return (
    <Form
      form={formIns}
      initialValues={initCertConfig}
      className="!h-[500px]"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
    >
      <div className="flex">
        <Form.Item
          field="name"
          label="名称"
          rules={[{ required: true, message: "请填写名称" }]}
        >
          <Input placeholder="请填写名称" />
        </Form.Item>
        <Form.Item field="type" label="类型">
          <Select />
        </Form.Item>
      </div>
      <div className="flex">
        <Form.Item field="domain" label="域名">
          <Input readOnly placeholder="填写证书后自动生成" />
        </Form.Item>
        <Form.Item field="issuer" label="颁发者">
          <Input readOnly placeholder="填写证书后自动生成" />
        </Form.Item>
      </div>
      <div className="flex">
        <Form.Item
          field="effectAt"
          label="生效时间"
          formatter={(t) =>
            t >= 0 ? dayjs.unix(t).format("YYYY-MM-DD HH:mm:ss") : ""
          }
        >
          <Input readOnly placeholder="填写证书后自动生成" />
        </Form.Item>
        <Form.Item
          field="expiredAt"
          label="过期时间"
          formatter={(t) =>
            t >= 0 ? dayjs.unix(t).format("YYYY-MM-DD HH:mm:ss") : ""
          }
        >
          <Input readOnly placeholder="填写证书后自动生成" />
        </Form.Item>
      </div>
      <div className="flex">
        <Form.Item field="pemPath" label="公钥pem路径">
          <Input readOnly placeholder="提交后自动生成" />
        </Form.Item>
        <Form.Item field="keyPath" label="私钥key路径">
          <Input readOnly placeholder="提交后自动生成" />
        </Form.Item>
      </div>

      <div className="flex">
        <Form.Item wrapperCol={{ span: 22, offset: 2 }}>
          <Form.Item
            field="pemRaw"
            rules={[
              {
                validateTrigger: "onChange",
                validator: pemValidator,
              },
            ]}
            normalize={(v) => v.trim()}
          >
            <Input.TextArea
              onChange={() => {
                void formIns.validate(["keyRaw"]);
              }}
              rows={12}
              placeholder="公钥pem数据"
              className="!resize-none"
            />
          </Form.Item>
          <Button
            className="!absolute right-0 bottom-[-12px] z-10"
            icon={<IconUpload />}
            onClick={async () => {
              const file = await fileUpload();
              const reader = new FileReader();
              reader.onload = () => {
                formIns.setFieldValue("pemRaw", reader.result as string);
                void formIns.validate(["pemRaw", "keyRaw"]);
              };
              reader.onerror = () => {
                Message.error("文件读取失败");
              };
              reader.readAsText(file);
            }}
          >
            上传
          </Button>
        </Form.Item>
        <Form.Item wrapperCol={{ span: 22, offset: 2 }}>
          <Form.Item
            field="keyRaw"
            rules={[
              {
                validateTrigger: "onChange",
                validator: keyValidator,
              },
            ]}
            normalize={(v) => v.trim()}
          >
            <Input.TextArea
              rows={12}
              placeholder="私钥key数据"
              className="!resize-none"
            />
          </Form.Item>
          <Button
            className="!absolute right-0 bottom-[-12px] z-10"
            icon={<IconUpload />}
            onClick={async () => {
              const file = await fileUpload();
              const reader = new FileReader();
              reader.onload = () => {
                formIns.setFieldValue("keyRaw", reader.result as string);
                void formIns.validate(["keyRaw"]);
              };
              reader.onerror = () => {
                Message.error("文件读取失败");
              };
              reader.readAsText(file);
            }}
          >
            上传
          </Button>
        </Form.Item>
      </div>
    </Form>
  );
};
