import dayjs from "dayjs";
import { type EasLog } from "../interface";

export interface Proc {
  key: string;
  parentKey: string;
  name: string;
  depth: number;
  width: number;

  app: string;
  srv: string;
  logs: EasLog[];
}

export const calcProc = (logs: EasLog[]) => {
  const procMap: Record<string, Proc> = {};
  logs.forEach((log) => {
    if (!procMap[log.trace.prockey]) {
      const procLists = log.trace.proclist.split(", ");
      const procKeys = log.trace.prockey.split(", ");
      if (procLists.length !== procKeys.length) {
        return;
      }

      for (let ind = procKeys.length - 1; ind >= 0; ind--) {
        const key = procKeys.slice(0, ind + 1).join(", ");
        if (!procMap[key]) {
          procMap[key] = {
            key,
            parentKey: procKeys.slice(0, ind).join(", "),
            name: procLists[ind]!,
            depth: ind,
            width: ind === procKeys.length - 1 ? 0 : 1,
            app: "",
            srv: "",
            logs: [],
          };
        } else {
          procMap[key].width++;
          if (procMap[key].width === 1) {
            break;
          }
        }
      }
    }

    procMap[log.trace.prockey]!.app = log.app;
    procMap[log.trace.prockey]!.srv = log.srv;
    procMap[log.trace.prockey]!.logs.push(log);
  });
  const procList = Object.values(procMap);
  procList.forEach((proc) => {
    proc.logs.sort((a, b) => {
      return a.num - b.num;
    });
  });
  // console.log(procList);
  return { procList, procMap };
};

export const makeProcGraph = (procList: Proc[]) => {
  const data = procList.map((proc) => {
    return {
      name: proc.key,
      label: `${proc.srv} / ${proc.name}`,
      value: proc.width || 1,
      depth: proc.depth,
    };
  });

  const links = procList
    .filter((proc) => proc.parentKey)
    .map((proc) => {
      return {
        source: proc.parentKey,
        target: proc.key,
        value: proc.width || 1,
      };
    });

  return {
    data,
    links,
  };
};
