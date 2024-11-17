import { Layout, Menu, Switch } from "@arco-design/web-react";
import { IconCalendar, IconMoon, IconSun } from "@arco-design/web-react/icon";
import { Suspense, useLayoutEffect, useMemo } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { maxBy } from "lodash-es";
import { useLocalStorageState } from "ahooks";
import { useDarkMode } from "@/common/useDarkMode";

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
  useLayoutEffect(() => {
    document.body.setAttribute("arco-theme", isDark ? "dark" : "");
  }, [isDark]);

  return (
    <Layout className="min-h-full">
      <Layout.Header className="flex justify-between px-4 items-center h-12 bg-color-bg-2 shadow z-10 border-b border-color-border-2">
        <div className="text-xl">NginxMaster</div>
        <div>
          <Switch
            checkedText={<IconMoon />}
            uncheckedText={<IconSun />}
            checked={isDark}
            onChange={setIsDark}
          />
        </div>
      </Layout.Header>

      <Layout>
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

        <Layout.Content>
          <Suspense>
            <Outlet />
          </Suspense>
        </Layout.Content>
      </Layout>
    </Layout>
  );
};
