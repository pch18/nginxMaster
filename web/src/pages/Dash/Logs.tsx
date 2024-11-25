import { useNginxLog } from "@/common/useNginxLogs";
import { OverflowTooltip } from "@/components/OverflowTooltip";
import { useVirtualList } from "ahooks";
import { type FC, useEffect, useRef } from "react";

export const Logs: FC<{ className?: string }> = ({ className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { logs, run, searchRule } = useNginxLog();
  useEffect(run, []);
  useEffect(() => {
    containerRef.current!.scrollTop = 0;
  }, [searchRule]);

  const [virtualLogs] = useVirtualList(logs, {
    containerTarget: containerRef,
    wrapperTarget: wrapperRef,
    itemHeight: 20,
    overscan: 30,
  });

  return (
    <div
      className={`flex flex-col ${className} border-t font-mono text-xs leading-5`}
      // eslint-disable-next-line react/no-unknown-property
      css={`
        .cell {
          height: 100%;
          border-right-width: 1px;
          padding: 0 4px;
          flex: none;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `}
    >
      <div className="h-5 flex border-l bg-[var(--color-secondary)] font-medium">
        <div className="cell w-[152px]">时间</div>
        <div className="cell w-[40px]">方法</div>
        <div className="cell !flex-[3]">地址</div>
        <div className="cell w-[38px]">状态</div>
        <div className="cell w-[54px]">耗时</div>
        <div className="cell w-[68px]">收到字节</div>
        <div className="cell w-[68px]">发送字节</div>
        <div className="cell !flex-[1] min-w-[120px]">来源IP</div>
        <div className="cell !flex-[1] min-w-[80px]">Referer</div>
        <div className="cell !flex-[1]  min-w-[80px]">UserAgent</div>
      </div>
      <div
        ref={containerRef}
        className="overflow-y-auto whitespace-nowrap flex-1 select-text"
      >
        <div ref={wrapperRef} className="border-b">
          {virtualLogs.map(({ data }) => (
            <div
              key={data.pos}
              className="h-5 flex border-t border-l items-center"
            >
              <div className="cell w-[152px]">{data.timeStr}</div>
              <div className="cell w-[40px]">{data.method}</div>
              <OverflowTooltip className="cell !flex-[3]">
                {data.fullUrl}
              </OverflowTooltip>
              <div
                className="cell w-[38px] text-right"
                style={{ color: data.statusCor }}
              >
                {data.status}
              </div>
              <div
                className="cell w-[54px] text-right"
                style={{ color: data.reqTimeCor }}
              >
                {data.reqTimeStr}
              </div>
              <div
                className="cell w-[68px] text-right"
                style={{ color: data.reqLenCor }}
              >
                {data.reqLenStr}
              </div>
              <div
                className="cell w-[68px] text-right"
                style={{ color: data.respLenCor }}
              >
                {data.respLenStr}
              </div>
              <OverflowTooltip className="cell !flex-[1] min-w-[120px]">
                {data.remoteAddr}
                {data.xff ? ` [${data.xff}]` : ""}
              </OverflowTooltip>
              <OverflowTooltip className="cell !flex-[1] min-w-[80px]">
                {data.referer}
              </OverflowTooltip>
              <OverflowTooltip className="cell !flex-[1] min-w-[80px]">
                {data.ua}
              </OverflowTooltip>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
