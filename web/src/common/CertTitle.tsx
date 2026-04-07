import { useMemo, type FC } from "react";
import { type CertConfig } from "./interface";
import { Tag } from "@arco-design/web-react";
import dayjs from "dayjs";
import { pickCN } from "@/utils/parseCert";
import { OverflowTooltip } from "@/components/OverflowTooltip";

export const CertExpireTag: FC<{
  expiredAt: number;
  className?: string;
}> = ({ expiredAt, className }) => {
  const days = useMemo(
    () => dayjs.unix(expiredAt).diff(dayjs(), "d"),
    [expiredAt]
  );
  const tagColor = useMemo(() => {
    if (days <= 7) {
      return "red";
    }
    if (days <= 30) {
      return "orange";
    }
    if (days <= 90) {
      return "purple";
    }
    return "green";
  }, [days]);

  return (
    <Tag className={className} size="small" color={tagColor}>
      剩{days}天
    </Tag>
  );
};

export const CertTitle: FC<{
  certConfig: CertConfig;
  className?: string;
}> = ({ certConfig, className }) => {
  return (
    <div className={className}>
      <div className="h-7 whitespace-nowrap">
        {certConfig.name}
        <CertExpireTag className="ml-2" expiredAt={certConfig.expiredAt} />
      </div>
      <div className="whitespace-nowrap">
        <Tag size="small" bordered>
          <OverflowTooltip className="max-w-40">
            {certConfig.domain}
          </OverflowTooltip>
        </Tag>
        <Tag className="ml-2" size="small" color="gold" bordered>
          <OverflowTooltip className="max-w-40">
            {pickCN(certConfig.issuer)}
          </OverflowTooltip>
        </Tag>
      </div>
    </div>
  );
};
