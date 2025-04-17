import { useEffect, type FC } from "react";
import { GraphProc } from "./GraphProc";
import { useRequest } from "ahooks";
import { logsData } from "./logsData";
import { type EasLog } from "../interface";
import ReactJson from "react-json-view";
import { useDarkMode } from "../useDarkMode";

export const TraceIdResult: FC<{ traceId: string; className?: string }> = ({
  traceId,
  className,
}) => {
  const [isDark] = useDarkMode();
  const { data, loading, refreshAsync } = useRequest(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
    return logsData as any as EasLog[];
  });

  if (!data) {
    return <div className={className}>Loading</div>;
  }

  return (
    <div className={className}>
      <GraphProc logs={data} className="sticky top-0 sca" />
      <ReactJson
        src={data}
        displayDataTypes={false}
        theme={isDark ? "monokai" : "rjv-default"}
      />
    </div>
  );
};
