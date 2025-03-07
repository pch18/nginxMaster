import { Button, Form, Modal, Popconfirm, Space } from "@arco-design/web-react";
import { createNiceModal } from "../../../utils/nicemodel";
import useForm from "@arco-design/web-react/es/Form/useForm";
import { type CertConfig, type ServerConfig } from "@/common/interface";
import { AsyncButton } from "@/components/AsyncButton";
import { newCertConfig } from "@/common/newConfig";
import { request } from "@/utils/request";
import { FormContext } from "./FormContent";
import { useMemo } from "react";
import { actionNotification } from "@/common/actionNotification";

export const openCertModal = createNiceModal<
  { certConfig?: CertConfig; title: string },
  { certConfig?: CertConfig }
>(({ _modal, certConfig, title }) => {
  const initCertConfig = useMemo(() => {
    return certConfig ?? newCertConfig();
  }, []);

  const [formIns] = useForm();
  return (
    <Modal
      {..._modal.props}
      maskClosable={false}
      title={
        <span>
          <span>{title || "证书信息"} </span>
          <span className="select-text">{initCertConfig.id}</span>
        </span>
      }
      className="min-w-[650px] max-w-[1024px] !w-[65vw]"
      footer={
        <Space size="medium">
          {certConfig && (
            <Popconfirm
              onOk={async () => {
                const res = await request.DelCert(initCertConfig.id);
                actionNotification(res.err, res.output);
                if (!res.err) {
                  _modal.resolve({});
                }
              }}
              title="确认删除？"
            >
              <Button status="danger">删除</Button>
            </Popconfirm>
          )}

          <AsyncButton
            type="primary"
            onClick={async () => {
              try {
                await formIns.validate();
              } catch (e) {
                const errKeys = Object.keys((e as any).errors);
                if (
                  errKeys.some((key) => key !== "keyRaw" && key !== "pemRaw")
                ) {
                  throw e;
                }
                await new Promise((resolve, reject) =>
                  Modal.confirm({
                    title: "证书校验失败，是否强行提交？",
                    okText: "强行提交，后果自负",
                    cancelText: "我再确认一下",
                    onOk: resolve,
                    onCancel: reject,
                  })
                );
              }
              const newCertConfig = formIns.getFields() as CertConfig;
              newCertConfig.updateAt = Date.now();

              const res = await request.SaveCert(newCertConfig);
              actionNotification(res.err, res.output);
              if (!res.err) {
                _modal.resolve({ certConfig: res.certConfig });
              }
            }}
          >
            提交
          </AsyncButton>
        </Space>
      }
    >
      <FormContext formIns={formIns} initCertConfig={initCertConfig} />
    </Modal>
  );
});
