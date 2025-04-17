import { type EasLog } from "../interface";

export interface Proc {
  key: string;
  parentKey: string;
  name: string;
  depth: number;
  width: number;

  app: string;
  srv: string;
  srvInd: number;
  logs: EasLog[];
  minAt: number;
  maxAt: number;
}

export const calcProc = (logs: EasLog[]) => {
  const procMap: Record<string, Proc> = {};
  const srvIndMap: Record<string, number> = {};
  let minAt = 0;
  let maxAt = 0;

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
            srvInd: 0,
            logs: [],
            minAt: 0,
            maxAt: 0,
          };
        } else {
          procMap[key].width++;
          if (procMap[key].width === 1) {
            break;
          }
        }
      }
    }

    const srvNoNum = log.app + log.srv.replace(/\d+$/, "");
    if (!srvIndMap[srvNoNum]) {
      srvIndMap[srvNoNum] = Object.keys(srvIndMap).length + 1;
    }
    const curProc = procMap[log.trace.prockey]!;
    curProc.app = log.app;
    curProc.srv = log.srv;
    curProc.srvInd = srvIndMap[srvNoNum]!;
    curProc.logs.push(log);

    if (log.time < minAt || minAt === 0) {
      minAt = log.time;
    }
    if (log.time < curProc.minAt || curProc.minAt === 0) {
      curProc.minAt = log.time;
    }
    if (log.time > maxAt) {
      maxAt = log.time;
    }
    if (log.time > curProc.maxAt) {
      curProc.maxAt = log.time;
    }
  });
  const procList = Object.values(procMap);
  procList.forEach((proc) => {
    proc.logs.sort((a, b) => {
      return a.num - b.num;
    });
  });
  return { procList, procMap, minAt, maxAt };
};

export const getColor = (ind: number, isDark = false) => {
  const mode = isDark ? "dark" : "light";
  return colors[mode][ind % colors[mode].length];
};

const colors = {
  light: [
    "#eff0f1",
    "#c2d4ff",
    "#f8c4e1",
    "#95e599",
    "#c8dd5f",
    "#fec48b",
    "#dcc9fd",
    "#fdc6c4",
    "#6fe8d8",
    "#97dcfc",
    "#fcdf7e",
  ],
  dark: [
    "#373737",
    "#194294",
    "#782b57",
    "#21511a",
    "#404c06",
    "#683a12",
    "#5529a3",
    "#7b2524",
    "#1d4e47",
    "#164359",
    "#63470f",
  ],
};

// light
// 淡(11) ['#eff0f1', '#c2d4ff', '#f8c4e1', '#95e599', '#c8dd5f', '#fec48b', '#dcc9fd', '#fdc6c4', '#6fe8d8', '#97dcfc', '#fcdf7e']
// 深(11) ['#bbbfc4','#5083fb', '#df58a5', '#32a645', '#7b9207',  '#ed6d0c', '#9f6ff1', '#f54a45', '#10a893', '#1295ca', '#d99904']

// dark
// 淡(11) ['#373737', '#194294', '#782b57', '#21511a', '#404c06', '#683a12', '#5529a3', '#7b2524', '#1d4e47', '#164359', '#63470f']
// 深(11) ['#5f5f5f','#3370eb', '#c24a8e', '#35872a', '#6b7f05',  '#b85e1a', '#8c55ec', '#d14642', '#198578', '#1a7fab', '#d49b0b']
