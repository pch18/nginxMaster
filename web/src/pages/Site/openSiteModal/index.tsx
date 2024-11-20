import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Space,
} from "@arco-design/web-react";
import { createNiceModal } from "../../../utils/nicemodel";
import { PanelBasic } from "./PanelBasic";
import { PanelLocations } from "./PanelLocations";
import useForm from "@arco-design/web-react/es/Form/useForm";
import { type ServerConfig } from "@/common/interface";
import { AsyncButton } from "@/components/AsyncButton";
import { makeNginxServerConfig } from "@/common/makeNginxConfig";
import { newServerConfig } from "@/common/newConfig";
import { request } from "@/utils/request";
import { useMemo } from "react";
import { actionNotification } from "@/common/actionNotification";

export const openSiteModal = createNiceModal<
  { serverConfig?: ServerConfig },
  { serverConfig?: ServerConfig }
>(({ _modal, serverConfig }) => {
  const initServerConfig = useMemo(() => {
    return serverConfig ?? newServerConfig();
  }, []);

  const [formIns] = useForm();
  return (
    <Modal
      {..._modal.props}
      maskClosable={false}
      footer={
        <Space size="medium">
          {serverConfig && (
            <Popconfirm
              onOk={async () => {
                const res = await request.SaveSite(
                  initServerConfig.id,
                  null,
                  ""
                );
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

          <Button
            type="outline"
            onClick={async () => {
              await formIns.validate();
              const newServerConfig = formIns.getFields() as ServerConfig;
              const nginxCfg = makeNginxServerConfig(newServerConfig);
              Modal.info({
                title: "Nginx 配置文件预览",
                footer: null,
                className: "min-w-[720px] !w-[75vw]",
                closable: true,
                content: (
                  <Input.TextArea
                    readOnly
                    className="!h-[55vh]"
                    value={nginxCfg}
                  >
                    {nginxCfg}
                  </Input.TextArea>
                ),
              });
            }}
          >
            预览
          </Button>
          <AsyncButton
            type="primary"
            status="success"
            onClick={async () => {
              await formIns.validate();
              const newServerConfig = formIns.getFields() as ServerConfig;
              const nginxCfg = makeNginxServerConfig(newServerConfig);
              const res = await request.VerifySite(nginxCfg);
              actionNotification(res.err, res.output);
            }}
          >
            测试
          </AsyncButton>
          <AsyncButton
            type="primary"
            onClick={async () => {
              await formIns.validate();
              const newServerConfig = formIns.getFields() as ServerConfig;
              newServerConfig.updateAt = Date.now();

              const nginxCfg = makeNginxServerConfig(newServerConfig);
              const res = await request.SaveSite(
                newServerConfig.id,
                newServerConfig,
                nginxCfg
              );
              actionNotification(res.err, res.output);
              if (!res.err) {
                _modal.resolve({ serverConfig: newServerConfig });
              }
            }}
          >
            提交
          </AsyncButton>
        </Space>
      }
      title={
        <span>
          <span>站点信息 </span>
          <span className="select-text">{initServerConfig.id}</span>
        </span>
      }
      className="min-w-[820px] max-w-[1280px] !w-[85vw]"
    >
      <Form
        form={formIns}
        initialValues={initServerConfig}
        className="!h-[65vh]"
      >
        <div className="flex min-h-0">
          <PanelBasic
            formIns={formIns}
            className="flex-1 h-full overflow-y-auto"
          />
          <div className="w-5" />
          <PanelLocations className="flex-1 h-full overflow-y-auto" />
        </div>
      </Form>
    </Modal>
  );
});
