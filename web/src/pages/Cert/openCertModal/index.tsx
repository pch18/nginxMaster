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
  { certConfig?: CertConfig },
  { certConfig?: CertConfig }
>(({ _modal, certConfig }) => {
  const initCertConfig = useMemo(() => {
    return certConfig ?? newCertConfig();
  }, []);

  const [formIns] = useForm();
  return (
    <Modal
      {..._modal.props}
      maskClosable={false}
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
              await formIns.validate();
              const newCertConfig = formIns.getFields() as CertConfig;
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
      title={
        <span>
          <span>证书信息 </span>
          <span className="select-text">{initCertConfig.id}</span>
        </span>
      }
      className="min-w-[650px] max-w-[1024px] !w-[65vw]"
    >
      <FormContext formIns={formIns} initCertConfig={initCertConfig} />
    </Modal>
  );
});
