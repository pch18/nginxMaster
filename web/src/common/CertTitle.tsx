import { type FC } from "react";
import { type CertConfig } from "./interface";
import { Tag } from "@arco-design/web-react";
import dayjs from "dayjs";

export const CertTitle: FC<{
  certConfig: CertConfig;
  className?: string;
}> = ({ certConfig, className }) => {
  return (
    <div className={className}>
      <div className="h-7 whitespace-nowrap">
        {certConfig.name}
        <Tag className="ml-2" size="small" color="green">
          剩{dayjs(certConfig.expiredAt).diff(dayjs(), "d")}天
        </Tag>
      </div>
      <div className="whitespace-nowrap">
        <Tag size="small" bordered>
          {certConfig.domain}
        </Tag>
        <Tag className="ml-2" size="small" color="gold" bordered>
          {certConfig.issuer}
        </Tag>
      </div>
    </div>
  );
};
