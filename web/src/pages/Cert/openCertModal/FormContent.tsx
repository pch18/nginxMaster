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
import * as jsrsasign from "jsrsasign";
import { type FC } from "react";
import { certTimeToStamp } from "./utils";
import dayjs from "dayjs";
import { fileUpload } from "@/utils/fileUpload";

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
    if (
      !pemRaw?.includes("-----BEGIN CERTIFICATE-----") ||
      !pemRaw?.includes("-----END CERTIFICATE-----")
    ) {
      clearCertInfo();
      cb("无效的证书格式");
      return;
    }
    try {
      const x509 = new jsrsasign.X509();
      x509.readCertPEM(pemRaw);
      const subjectCN = x509.getSubjectString(); // 获取主题信息
      const issuerCN = x509.getIssuerString(); // 获取颁发者信息
      const notBefore = x509.getNotBefore(); // 获取证书生效时间
      const notAfter = x509.getNotAfter(); // 获取证书到期时间

      formIns.setFieldsValue({
        domain: subjectCN.match(/\/CN=([^/]+)/)?.[1] ?? subjectCN,
        issuer: issuerCN.match(/\/CN=([^/]+)/)?.[1] ?? issuerCN,
        effectAt: certTimeToStamp(notBefore),
        expiredAt: certTimeToStamp(notAfter),
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
    if (
      !keyRaw?.includes("-----BEGIN PRIVATE KEY-----") ||
      !keyRaw?.includes("-----END PRIVATE KEY-----")
    ) {
      cb("无效的证书格式");
      return;
    }
    try {
      const testData = "TEST";
      const pemRaw: string = formIns.getFieldValue("pemRaw");

      // 使用私钥对数据进行签名
      const sig = new jsrsasign.KJUR.crypto.Signature({ alg: "SHA256withRSA" });
      sig.init(keyRaw);
      sig.updateString(testData);
      const signature = sig.sign();

      // 使用公钥验证签名
      const verify = new jsrsasign.KJUR.crypto.Signature({
        alg: "SHA256withRSA",
      });
      verify.init(pemRaw);
      verify.updateString(testData);
      const isValid = verify.verify(signature);
      if (!isValid) {
        cb("证书验证失败");
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
            t >= 0 ? dayjs(t).format("YYYY-MM-DD HH:mm:ss") : ""
          }
        >
          <Input readOnly placeholder="填写证书后自动生成" />
        </Form.Item>
        <Form.Item
          field="expiredAt"
          label="过期时间"
          formatter={(t) =>
            t >= 0 ? dayjs(t).format("YYYY-MM-DD HH:mm:ss") : ""
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
