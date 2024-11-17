import { ConstMapLocationRedirectCode } from "@/common/const";
import { useConstOption } from "@/common/constUtils";
import { type LocationConfig, LocationMode } from "@/common/interface";
import { Checkbox, Form, Input, Select, Switch } from "@arco-design/web-react";
import { type FC } from "react";

export const PanelLocationExtra: FC<{
  location: LocationConfig;
  field: string;
}> = ({ location, field }) => {
  const locationRedirectCodeOptions = useConstOption(
    ConstMapLocationRedirectCode
  );

  if (location.mode === LocationMode.Static) {
    return (
      <>
        <Form.Item
          label="目录"
          field={`${field}.static_root`}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          rules={[{ required: true, message: "请选择类型" }]}
        >
          <Input />
        </Form.Item>

        <div className="flex">
          <Form.Item
            label="Index"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
          >
            <div className="flex items-center gap-2">
              <Form.Item
                field={`${field}.static_indexEn`}
                triggerPropName="checked"
                noStyle
              >
                <Checkbox />
              </Form.Item>
              <Form.Item
                disabled={!location.static_indexEn}
                field={`${field}.static_index`}
                noStyle
              >
                <Input />
              </Form.Item>
            </div>
          </Form.Item>

          <Form.Item
            label="Spa"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
          >
            <div className="flex items-center gap-2">
              <Form.Item
                field={`${field}.static_spaEn`}
                triggerPropName="checked"
                noStyle
              >
                <Checkbox />
              </Form.Item>
              <Form.Item
                disabled={!location.static_spaEn}
                field={`${field}.static_spa`}
                noStyle
              >
                <Input />
              </Form.Item>
            </div>
          </Form.Item>
        </div>
      </>
    );
  } else if (location.mode === LocationMode.Proxy) {
    return (
      <>
        <Form.Item
          label="对端"
          field={`${field}.proxy_target`}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          rules={[{ required: true, message: "请选择类型" }]}
        >
          <Input />
        </Form.Item>

        <div className="flex">
          <Form.Item
            label="Host"
            field={`${field}.proxy_host`}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="开启WebSocket"
            field={`${field}.proxy_wsEn`}
            labelCol={{ span: 16 }}
            wrapperCol={{ span: 8 }}
            triggerPropName="checked"
          >
            <Switch />
          </Form.Item>
        </div>
      </>
    );
  } else if (location.mode === LocationMode.Redirect) {
    return (
      <>
        <Form.Item
          label="网址"
          field={`${field}.redirect_target`}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          rules={[{ required: true, message: "请选择类型" }]}
        >
          <Input />
        </Form.Item>
        <div className="flex">
          <Form.Item
            label="方式"
            field={`${field}.redirect_code`}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
          >
            <Select options={locationRedirectCodeOptions} />
          </Form.Item>

          <Form.Item
            label="携带原路径"
            field={`${field}.redirect_takeUri`}
            labelCol={{ span: 16 }}
            wrapperCol={{ span: 8 }}
            triggerPropName="checked"
          >
            <Switch />
          </Form.Item>
        </div>
      </>
    );
  }

  return null;
};
