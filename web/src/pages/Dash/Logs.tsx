import { useNginxLog } from "@/common/useNginxLogs";
import { OverflowTooltip } from "@/components/OverflowTooltip";
import { useVirtualList } from "ahooks";
import { type FC, useEffect, useRef } from "react";

export const Logs: FC<{ className?: string }> = ({ className = "" }) => {
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);

  const { logs, run } = useNginxLog();
  useEffect(run, []);

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
        <div className="cell w-[147px]">时间</div>
        <div className="cell w-[38px]">方法</div>
        <div className="cell !flex-[3]">地址</div>
        <div className="cell w-[33px]">状态</div>
        <div className="cell w-[53px]">耗时</div>
        <div className="cell w-[60px]">收到字节</div>
        <div className="cell w-[60px]">发送字节</div>
        <div className="cell w-[118px]">来源IP</div>
        <div className="cell !flex-[1]">Referer</div>
        <div className="cell !flex-[1]">UserAgent</div>
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
              <div className="cell w-[147px]">{data.timeStr}</div>
              <div className="cell w-[38px]">{data.method}POST</div>
              <OverflowTooltip className="cell !flex-[3]">
                {data.schema}://{data.host}:{data.port}
                {data.uri}
                {data.args}
              </OverflowTooltip>
              <div className="cell w-[33px] text-right">{data.status}</div>
              <div className="cell w-[53px] text-right">{data.reqTimeStr}</div>
              <div className="cell w-[60px] text-right">{data.reqLenStr}</div>
              <div className="cell w-[60px] text-right">{data.respLenStr}</div>
              <div className="cell w-[118px]">
                {data.xff || data.remoteAddr}
              </div>
              <OverflowTooltip className="cell !flex-[1]">
                {data.referer}
              </OverflowTooltip>
              <OverflowTooltip className="cell !flex-[1]">
                {data.ua}
              </OverflowTooltip>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
