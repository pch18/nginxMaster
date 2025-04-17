import { useMemo, type FC } from "react";
import ReactECharts, { type EChartsOption } from "echarts-for-react";
import { useDarkMode } from "@/common/useDarkMode";
import { type EasLog } from "@/common/interface";
import clsx from "clsx";
import { calcProc, makeProcGraph } from "./utils";

export const GraphProc: FC<{ logs: EasLog[]; className?: string }> = ({
  logs,
  className,
}) => {
  const [dark] = useDarkMode();
  const { data, links, procMap } = useMemo(() => {
    const { procList, procMap } = calcProc(logs);
    const { data, links } = makeProcGraph(procList);
    return { data, links, procMap };
  }, [logs]);

  const option = useMemo(() => {
    const _opts: EChartsOption = {
      backgroundColor: "transparent",
      animation: false,
      series: {
        type: "sankey",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        layout: "none",
        layoutIterations: 0,
        label: {
          position: "inside",
          overflow: "truncate",
          formatter: (params: any) => {
            return params.data.label;
          },
        },
        labelLayout: (params: any) => {
          return {
            width: params.rect.width,
          };
        },
        edgeLabel: {
          show: true,
        },
        // nodeAlign: "right",
        emphasis: {
          focus: "trajectory",
        },
        // selectedMode: "single",
        orient: "vertical",
        draggable: false,
        data,
        links,
      },
    };
    return _opts;
  }, [logs]);

  return (
    <ReactECharts
      className={clsx("!h-[160px]", className)}
      option={option}
      theme={dark ? "dark" : undefined}
    />
  );
};
