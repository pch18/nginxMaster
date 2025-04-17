import { useMemo, useState, type FC } from "react";
import { GraphProc } from "./GraphProc";
import { useRequest } from "ahooks";
import { logsData } from "./logsData";
import {
  EasLogLevelColorMap,
  EasLogLevelIconMap,
  type EasLog,
} from "../interface";
import ReactJson from "react-json-view";
import { useDarkMode } from "../useDarkMode";
import dayjs from "dayjs";
import { calcProc } from "./utils";
import { Collapse } from "@arco-design/web-react";

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
  const [isDark] = useDarkMode();

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

  return (
    <>
      <GraphProc
        procList={procList}
        select={select}
        handleSelect={handleSelect}
        className="sticky top-0 bg-[var(--color-bg-1)] z-10"
      />

      <Collapse className="select-text">
        {curLogs.map((log) => (
          <Collapse.Item
            key={log._id.toString()}
            name={log._id.toString()}
            header={
              <>
                <span
                  className="inline-flex items-center"
                  style={{ color: EasLogLevelColorMap[log.level] }}
                >
                  [{EasLogLevelIconMap[log.level]}
                  {log.level}]
                </span>
                <span className="ml-1">
                  {log.srv} / {log.kind} :
                </span>
              </>
            }
            extra={
              <div className="text-xs text-color-text-3">
                {dayjs(log.time).format("YYYY/MM/DD HH:mm:ss")}
              </div>
            }
          >
            <ReactJson
              src={log}
              displayDataTypes={false}
              theme={isDark ? "monokai" : "rjv-default"}
            />
          </Collapse.Item>
        ))}
      </Collapse>
    </>
  );
};
