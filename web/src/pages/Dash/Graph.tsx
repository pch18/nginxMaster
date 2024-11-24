import { request, type SysInfo } from "@/utils/request";
import { useInterval } from "ahooks";
import { useState } from "react";
import { GraphNet } from "./GraphNet";
import { GraphCpu } from "./GraphCpu";

export const Graph = () => {
  const [sysList, setSysList] = useState<SysInfo[]>([]);
  useInterval(
    async () => {
      const res = await request.getSys(sysList[sysList.length - 1]?.t ?? 0);
      setSysList((list) => [...list, ...res.list].slice(-res.total));
    },
    10000,
    { immediate: true }
  );

  return (
    <div className="pb-2 flex gap-2">
      <div className="flex-[3]">
        <div className="font-bold text-lg mb-2">系统性能</div>
        <GraphCpu sysList={sysList} />
      </div>
      <div className="flex-[4]">
        <div className="font-bold text-lg mb-2">网络流量</div>
        <GraphNet sysList={sysList} />
      </div>
    </div>
  );
};
