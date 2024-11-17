import { Notification } from "@arco-design/web-react";

export const actionNotification = (err: string | undefined, output: string) => {
  Notification.clear();
  Notification[err ? "error" : "success"]({
    duration: 2000,
    closable: true,
    title: err ? "执行失败" : "执行成功",
    content: (
      <div>
        {[...(err?.split("\n") || []), ...(output?.split("\n") || [])].map(
          (c, i) => (
            <div key={i} className="mb-2 select-text">
              {c}
            </div>
          )
        )}
      </div>
    ),
    className: err ? "!w-[600px]" : "!w-[400px]",
  });
};
