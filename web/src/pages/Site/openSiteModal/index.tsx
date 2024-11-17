import {
  Button,
  Form,
  Input,
  Notification,
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

export const handleNotification = (err: any, output?: string) => {
  Notification.clear();
  Notification[err ? "error" : "success"]({
    duration: 3000,
    closable: true,
    title: err ? "执行失败" : "执行成功",
    content: (
      <div>
        {output?.split("\n").map((c, i) => (
          <div key={i} className="mb-2 select-text">
            {c}
          </div>
        ))}
      </div>
    ),
    className: err ? "!w-[600px]" : "!w-[400px]",
  });
};

export const openSiteModal = createNiceModal<
  { serverConfig?: ServerConfig },
  { serverConfig?: ServerConfig }
>(({ _modal, serverConfig = newServerConfig() }) => {
  const [formIns] = useForm();
  return (
    <Modal
      {..._modal.props}
      maskClosable={false}
      footer={
        <Space size="medium">
          <Popconfirm
            onOk={async () => {
              const res = await request.SaveSite(serverConfig.id, null, "");
              handleNotification(res.err, res.output);
              if (!res.err) {
                _modal.resolve({});
              }
            }}
            title="确认删除？"
          >
            <Button status="danger">删除</Button>
          </Popconfirm>

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
              handleNotification(res.err, res.output);
            }}
          >
            测试
          </AsyncButton>
          <AsyncButton
            type="primary"
            onClick={async () => {
              await formIns.validate();
              const newServerConfig = formIns.getFields() as ServerConfig;
              const nginxCfg = makeNginxServerConfig(newServerConfig);
              const res = await request.SaveSite(
                newServerConfig.id,
                newServerConfig,
                nginxCfg
              );
              handleNotification(res.err, res.output);
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
          <span className="select-text">{serverConfig.id}</span>
        </span>
      }
      className="min-w-[820px] !w-[85vw]"
    >
      <Form form={formIns} initialValues={serverConfig} className="!h-[65vh]">
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
