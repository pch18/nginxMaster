import { Button, Layout, Menu, Switch } from "@arco-design/web-react";
import { IconCalendar, IconMoon, IconSun } from "@arco-design/web-react/icon";
import { Suspense, useLayoutEffect, useMemo } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { maxBy } from "lodash-es";
import { useDarkMode } from "@/common/useDarkMode";
import { AsyncButton } from "./AsyncButton";
import { request } from "@/utils/request";
import { openChangeAuthModal } from "@/common/openChangeAuthModal";
import { version } from "@/utils/version";

export const RouterLayout: React.FC<{
  menuItems: Array<{
    path: string;
    /** 跳转地址,不填则同path */
    link?: string;
    name: string;
    icon?: React.ReactElement;
  }>;
}> = ({ menuItems }) => {
  const location = useLocation();
  const openMenu = useMemo(() => {
    const matchedItems = menuItems.filter((item) => {
      return location.pathname.startsWith(item.path);
    });
    const bestItem = maxBy(matchedItems, (item) => item.path.length);
    return bestItem;
  }, [location]);

  const [isDark, setIsDark] = useDarkMode();

  return (
    <Layout className="h-full overflow-hidden">
      <Layout.Header className="flex justify-between px-4 items-center h-12 bg-color-bg-2 shadow z-10 border-b border-color-border-2">
        <div className="text-xl flex items-end">NginxMaster</div>
        <div className="flex items-center gap-4">
          <Switch
            checkedText={<IconMoon />}
            uncheckedText={<IconSun />}
            checked={isDark}
            onChange={setIsDark}
          />
          <Button
            onClick={() => {
              void openChangeAuthModal({});
            }}
          >
            修改密码
          </Button>
          <AsyncButton
            onClick={async () => {
              await request.Logout();
            }}
          >
            退出登录
          </AsyncButton>
        </div>
      </Layout.Header>

      {/* // arco-layout-has-sider 是为了避免框架无效重渲染，导致第一次content区域渲染宽度没有减去sider, 会导致 echart 首次加载时宽度异常 */}
      <Layout className="overflow-hidden arco-layout-has-sider">
        <Layout.Sider width={120}>
          <Menu selectedKeys={openMenu ? [openMenu.path] : []}>
            {menuItems.map((item) => (
              <Link to={item.link ?? item.path} key={item.path}>
                <Menu.Item key={item.path}>
                  {item.icon ?? <IconCalendar />}
                  {item.name}
                </Menu.Item>
              </Link>
            ))}
          </Menu>
        </Layout.Sider>

        <Layout.Content className="overflow-hidden flex flex-col">
          <div className="overflow-y-auto flex-1">
            <Suspense>
              <Outlet />
            </Suspense>
          </div>

          <Layout.Footer className="border-t border-color-border-2 flex justify-center text-sm">
            <span>NginxMaster v{version}</span>
            <span className="ml-6">
              Provided By{" "}
              <a
                href="https://pch18.cn/archives/529.html"
                className="underline"
                target="_blank"
                rel="noreferrer"
              >
                Pch18.cn
              </a>
            </span>
          </Layout.Footer>
        </Layout.Content>
      </Layout>
    </Layout>
  );
};
