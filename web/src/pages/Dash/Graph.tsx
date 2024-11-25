import { request, type SysInfo } from "@/utils/request";
import { useInterval } from "ahooks";
import { useEffect, useState } from "react";
import { GraphNet } from "./GraphNet";
import { GraphCpu } from "./GraphCpu";

export const Graph = () => {
  const [sysList, setSysList] = useState<SysInfo[]>([]);

  const run = async () => {
    const res = await request.getSys(sysList[sysList.length - 1]?.t ?? 0);
    setInterval(res.interval);
    setSysList((list) => [...list, ...res.list].slice(-res.total));
  };
  const [interval, setInterval] = useState<number>();
  useInterval(run, interval);
  useEffect(() => {
    void run();
  }, []);

  return (
    <div className="pb-2 flex gap-2">
      <div className="flex-[3]">
        <GraphCpu sysList={sysList} />
      </div>
      <div className="flex-[4]">
        <GraphNet sysList={sysList} />
      </div>
    </div>
  );
};
