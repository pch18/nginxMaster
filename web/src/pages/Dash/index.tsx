import { useNginxLog } from "@/common/useNginxLogs";
import { AsyncButton } from "@/components/AsyncButton";
import { request } from "@/utils/request";
import { version } from "@/utils/version";
import { Form, Input, Message } from "@arco-design/web-react";
import useForm from "@arco-design/web-react/es/Form/useForm";
import { useVirtualList } from "ahooks";
import { useEffect, useRef } from "react";

export default function () {
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);

  const logs = useNginxLog();

  const [virtualLogs] = useVirtualList(logs, {
    containerTarget: containerRef,
    wrapperTarget: wrapperRef,
    itemHeight: 32,
    overscan: 2,
  });

  return (
    <div className="h-full flex flex-col">
      <div className="h-8 flex border-b flex-none">
        <div className="w-10 truncate">Method</div>
        {/* <div className="w-10 truncate">{data.schema}</div>
        <div className="w-20 truncate">{data.host}</div>
        <div className="w-10 truncate">{data.port}</div>
        <div className="w-10 truncate">{data.uri}</div>
        <div className="w-10 truncate">{data.args}</div>
        <div className="w-10 truncate">{data.protocol}</div>
        <div className="w-10 truncate">{data.status}</div>
        <div className="w-10 truncate">{data.reqTime}</div>
        <div className="w-10 truncate">{data.reqLen}</div>
        <div className="w-10 truncate">{data.respLen}</div>
        <div className="w-10 truncate">{data.referer}</div>
        <div className="w-10 truncate">{data.ua}</div>
        <div className="w-10 truncate">{data.remoteAddr}</div>
        <div className="w-10 truncate">{data.xff}</div>
        <div className="w-10 truncate">{data.timeStr}</div> */}
      </div>
      <div
        ref={containerRef}
        className="overflow-y-auto whitespace-nowrap flex-1"
      >
        <div ref={wrapperRef}>
          {virtualLogs.map(({ data, index }) => (
            <div
              key={index}
              className="h-6 flex border-b border-l items-center"
            >
              <div className="h-full w-[150px] truncate border-r px-1 flex-none">
                {data.timeStr}
              </div>
              <div className="h-full w-[72px] truncate border-r px-1 flex-none">
                {data.method || "OPTIONS"}
              </div>
              <div className="h-full flex-[4] truncate border-r px-1">
                {data.schema}://{data.host}:{data.port}
                {data.uri}
                {data.args}
              </div>
              <div className="h-full w-[40px] truncate border-r px-1 flex-none">
                {data.status}
              </div>
              <div className="h-full w-[40px] truncate border-r px-1 flex-none">
                {data.reqTime}s
              </div>
              <div className="h-full w-[60px] truncate border-r px-1 flex-none">
                {data.reqLen}B
              </div>
              <div className="h-full w-[60px] truncate border-r px-1 flex-none">
                {data.respLen}B
              </div>
              <div className="h-full w-[80px] truncate border-r px-1 flex-none">
                {data.xff || data.remoteAddr}
              </div>
              <div className="h-full flex-[1] truncate border-r px-1">
                {data.referer}
              </div>
              <div className="h-full flex-[1] truncate border-r px-1">
                {data.ua}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
