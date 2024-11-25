import { type SysInfo } from "@/utils/request";
import { type FC } from "react";
import ReactECharts from "echarts-for-react";
import { useDarkMode } from "@/common/useDarkMode";
import dayjs from "dayjs";
import { formatBytes } from "@/common/utils";

export const GraphNet: FC<{ sysList: SysInfo[] }> = ({ sysList }) => {
  const [dark] = useDarkMode();

  const option = {
    animation: false,
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "line",
      },
      formatter: function (params: any) {
        const ns = params.find((item: any) => item.seriesIndex === 0);
        const t1 = `${ns.marker} ${ns.seriesName}：${formatBytes(
          ns.value
        )}  （总 ${formatBytes(sysList[ns.dataIndex]?.ns || 0)}）`;

        const nr = params.find((item: any) => item.seriesIndex === 1);
        const t2 = `${nr.marker} ${nr.seriesName}：${formatBytes(
          nr.value
        )}  （总 ${formatBytes(sysList[nr.dataIndex]?.nr || 0)}）`;

        return `${params[0].axisValueLabel}<br/>${t1}<br/>${t2}`;
      },
    },
    title: {
      text: "网络流量",
    },
    legend: {
      data: ["接收", "发送"],
    },
    grid: {
      top: 40,
      left: 0,
      right: 0,
      bottom: 0,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: sysList
        .slice(1)
        .map((item) => dayjs(item.t).format("YYYY-MM-DD\nHH:mm:ss")),
      boundaryGap: false,
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: formatBytes,
      },
    },
    series: [
      {
        name: "接收",
        type: "line",
        showSymbol: false,
        areaStyle: {},
        smooth: true,
        data: sysList
          .map((item, index, list) => {
            if (index === 0) {
              return 0;
            }
            const diffTime = item.t - list[index - 1]!.t;
            const diffBytes = item.nr - list[index - 1]!.nr;
            return Math.round((diffBytes / diffTime) * 1000);
          })
          .slice(1),
      },
      {
        name: "发送",
        type: "line",
        showSymbol: false,
        areaStyle: {},
        smooth: true,
        data: sysList
          .map((item, index, list) => {
            if (index === 0) {
              return 0;
            }
            const diffTime = item.t - list[index - 1]!.t;
            const diffBytes = item.ns - list[index - 1]!.ns;
            return Math.round((diffBytes / diffTime) * 1000);
          })
          .slice(1),
      },
    ],
  };

  return (
    <ReactECharts
      className="!h-[220px]"
      option={option}
      theme={dark ? "dark" : undefined}
    />
  );
};
