import { Divider, Form, Input, Message, Modal } from "@arco-design/web-react";
import { createNiceModal } from "@/utils/nicemodel";
import useForm from "@arco-design/web-react/es/Form/useForm";
import { request } from "@/utils/request";

export const openChangeAuthModal = createNiceModal(({ _modal }) => {
  const [formIns] = useForm();
  return (
    <Modal
      {..._modal.props}
      maskClosable={false}
      title="修改密码"
      onOk={async () => {
        const { oldName, oldPass, newName, newPass } =
          (await formIns.validate()) as Record<string, string>;
        const oldAuth = btoa(`${oldName || ""}:${oldPass || ""}`);
        const newAuth = btoa(`${newName || ""}:${newPass || ""}`);
        const { err } = await request.SetAuth(oldAuth, newAuth);
        if (err) {
          Message.error(err);
        } else {
          location.reload();
        }
      }}
    >
      <Form form={formIns} wrapperCol={{ span: 16 }} labelCol={{ span: 8 }}>
        <Form.Item
          field="oldName"
          label="旧用户名"
          initialValue=""
          rules={[{ required: true, message: "请填写旧用户名" }]}
        >
          <Input autoComplete="new-password" />
        </Form.Item>
        <Form.Item
          field="oldPass"
          label="旧密码"
          initialValue=""
          rules={[{ required: true, message: "请填写旧密码" }]}
        >
          <Input.Password autoComplete="new-password" />
        </Form.Item>
        <Divider />
        <Form.Item
          field="newName"
          label="新用户名"
          initialValue=""
          rules={[{ required: true, message: "请填写新用户名" }]}
        >
          <Input autoComplete="new-password" />
        </Form.Item>
        <Form.Item
          field="newPass"
          label="新密码"
          initialValue=""
          rules={[
            { required: true, message: "请填写新密码" },
            {
              validator(value, cb) {
                if (!value || value.length < 6) {
                  cb("密码至少6位");
                }
                cb();
              },
            },
          ]}
        >
          <Input.Password autoComplete="new-password" />
        </Form.Item>
        <Form.Item
          field="newPass2"
          label="新密码确认"
          initialValue=""
          rules={[
            { required: true, message: "请填写新密码确认" },
            {
              validator(value, cb) {
                if (
                  formIns.getFieldValue("newPass2") !==
                  formIns.getFieldValue("newPass")
                ) {
                  cb("两次密码不一致");
                }
                cb();
              },
            },
          ]}
        >
          <Input.Password autoComplete="new-password" />
        </Form.Item>
      </Form>
    </Modal>
  );
});
