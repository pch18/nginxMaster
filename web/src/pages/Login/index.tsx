import { AsyncButton } from "@/components/AsyncButton";
import { request } from "@/utils/request";
import { version } from "@/utils/version";
import { Form, Input, Message } from "@arco-design/web-react";
import useForm from "@arco-design/web-react/es/Form/useForm";
import { useRef } from "react";

export default function () {
  const [form] = useForm();
  const handleSubmit = async () => {
    const { username, password } = (await form.validate()) as Record<
      string,
      string
    >;
    const auth = btoa(`${username || ""}:${password || ""}`);
    const resp = await request.Login(auth);
    if (resp.err) {
      Message.error("登录失败");
    } else {
      Message.success("登录成功");
      window.location.pathname = "/";
    }
  };
  const btnRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="flex items-center justify-center w-full h-full">
      <Form
        form={form}
        className="!w-[60vw]  min-w-[320px] max-w-[640px]  bg-color-border-2 shadow-lg p-10"
      >
        <div className="text-4xl mx-auto pb-12">
          <div>Trace ID 日志查询</div>
          <div className="text-base text-left">
            <span>v{version}</span>
            <span className="float-right">
              by{" "}
              <a
                href="https://pch18.cn/archives/529.html"
                className="underline"
                target="_blank"
                rel="noreferrer"
              >
                Pch18.cn
              </a>
            </span>
          </div>
        </div>

        <div className="w-4/5 mx-auto flex flex-col gap-8">
          <Form.Item
            noStyle
            field="username"
            rules={[{ required: true, message: "请填写用户名" }]}
          >
            <Input
              placeholder="用户名"
              autoComplete="new-password"
              onPressEnter={() => {
                btnRef.current?.click();
              }}
            />
          </Form.Item>
          <Form.Item
            noStyle
            field="password"
            rules={[{ required: true, message: "请填写密码" }]}
          >
            <Input.Password
              placeholder="密码"
              autoComplete="new-password"
              onPressEnter={() => {
                btnRef.current?.click();
              }}
            />
          </Form.Item>
          <AsyncButton
            ref={btnRef}
            type="primary"
            className="mt-6"
            onClick={handleSubmit}
          >
            登录
          </AsyncButton>
        </div>
      </Form>
    </div>
  );
}
