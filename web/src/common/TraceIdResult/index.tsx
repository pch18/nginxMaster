import { useMemo, useState, type FC } from "react";
import { GraphProc } from "./GraphProc";
import { useRequest } from "ahooks";
import { logsData } from "./logsData";
import { type EasLogLevel, type EasLog } from "../interface";
import dayjs from "dayjs";
import { calcProc } from "./utils";
import { CollapseLog } from "./CollapseLog";
import { ToolBar } from "./ToolBar";

export const TraceIdResult: FC<{ traceId: string; className?: string }> = ({
  traceId,
  className,
}) => {
  const {
    data: logs,
    loading,
    refreshAsync,
  } = useRequest(async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const _logs = (logsData as any as EasLog[]).map((s) => ({
      ...s,
      time: dayjs(s.time).valueOf(),
    }));

    _logs.sort((s1, s2) => s1.time - s2.time);
    return _logs;
  });

  return (
    <div className={className}>
      {loading ? <div>loading</div> : <Content logs={logs || []} />}
    </div>
  );
};

const Content: FC<{ logs: EasLog[] }> = ({ logs }) => {
  const [select, setSelect] = useState<Set<string>>(new Set());
  const handleSelect = (key: string | undefined) => {
    setSelect((s) => {
      if (!key) {
        return new Set();
      } else if (s.has(key)) {
        const newS = new Set(s);
        newS.delete(key);
        return newS;
      } else {
        const newS = new Set(s);
        newS.add(key);
        return newS;
      }
    });
  };
  const { procList, procMap, minAt, maxAt } = useMemo(() => {
    return calcProc(logs);
  }, [logs]);

  const { curLogs } = useMemo(() => {
    if (select.size) {
      const _logs: EasLog[] = [];
      [...select].forEach((s) => {
        _logs.push(...(procMap[s]?.logs || []));
      });
      return {
        curLogs: _logs,
        // startTime: dayjs(proc.minAt).format("YYYY/MM/DD HH:mm:ss"),
        // duration: proc.maxAt - proc.minAt,
      };
    } else {
      return {
        curLogs: logs,
        // startTime: dayjs(minAt).format("YYYY/MM/DD HH:mm:ss"),
        // duration: maxAt - minAt,
      };
    }
  }, [logs, select]);

  const [filterLevels, setFilterLevels] = useState<EasLogLevel[]>([]);

  return (
    <>
      <div className="sticky top-0 bg-color-bg-1 z-10">
        <GraphProc
          procList={procList}
          select={select}
          handleSelect={handleSelect}
        />
        <div className="border-t mb-1" />
        <ToolBar
          className="py-2"
          logs={curLogs}
          filterLevels={filterLevels}
          setFilterLevels={setFilterLevels}
        />
      </div>

      <CollapseLog logs={curLogs} filterLevels={filterLevels} />
    </>
  );
};
