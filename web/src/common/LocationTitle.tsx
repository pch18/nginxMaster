import { useMemo, type FC } from "react";
import { LocationMode, type LocationConfig } from "./interface";
import { Tag } from "@arco-design/web-react";
import { ConstMapLocationMode } from "./const";
import clsx from "clsx";

export const LocationTitle: FC<{
  location: LocationConfig;
  className?: string;
}> = ({ location, className }) => {
  const paramText = useMemo(() => {
    if (location.mode === LocationMode.Static) {
      return `${ConstMapLocationMode[location.mode].label} ${
        location.static_root
      }`;
    } else if (location.mode === LocationMode.Proxy) {
      return `${ConstMapLocationMode[location.mode].label} ${
        location.proxy_target
      }`;
    } else if (location.mode === LocationMode.Redirect) {
      return `${ConstMapLocationMode[location.mode].label} ${
        location.redirect_target
      }`;
    } else {
      return ConstMapLocationMode[location.mode].label;
    }
  }, [location]);

  return (
    <div className={clsx(className, "overflow-hidden flex gap-1 items-center")}>
      <Tag size="small" bordered>
        {location.path}
      </Tag>

      <Tag
        size="small"
        bordered
        color={ConstMapLocationMode[location.mode].color}
      >
        {paramText}
      </Tag>
    </div>
  );
};
