import { type SysInfo } from "@/utils/request";
import { type FC } from "react";
import ReactECharts from "echarts-for-react";
import { useDarkMode } from "@/common/useDarkMode";
import dayjs from "dayjs";
import { formatBytes } from "@/common/utils";

export const GraphCpu: FC<{ sysList: SysInfo[] }> = ({ sysList }) => {
  const [dark] = useDarkMode();

  const option = {
    animation: false,
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "line",
      },
      // valueFormatter: console.log, // formatBytes,
      formatter: function (params: any) {
        const mu = params.find((item: any) => item.seriesIndex === 0);
        const t1 = `${mu.marker} ${mu.seriesName}：${formatBytes(mu.value)}`;

        const mt = params.find((item: any) => item.seriesIndex === 1);
        const t2 = `${mt.marker} ${mt.seriesName}：${formatBytes(mt.value)}`;

        const cp = params.find((item: any) => item.seriesIndex === 2);
        const t3 = `${cp.marker} ${cp.seriesName}：${cp.value.toFixed(1)} %`;

        return `${params[0].axisValueLabel}<br/>${t3}<br/>${t1}<br/>${t2}`;
      },
    },
    title: {
      text: "系统性能",
    },
    legend: {
      data: ["CPU", "占用内存", "全部内存"],
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
      data: sysList.map((item) => dayjs(item.t).format("YYYY-MM-DD\nHH:mm:ss")),
      boundaryGap: false,
    },
    yAxis: [
      {
        type: "value",
        max: sysList[0]?.mt ?? 0,
        min: 0,
        splitNumber: 5,
        interval: (sysList[0]?.mt ?? 0) / 5,
        axisLabel: {
          formatter: formatBytes,
        },
      },
      {
        type: "value",
        max: 100,
        min: 0,
        splitNumber: 5,
        interval: 20,
        axisLabel: {
          formatter: (v: number) => `${Math.round(v)} %`,
        },
      },
    ],

    series: [
      {
        name: "占用内存",
        type: "line",
        showSymbol: false,
        areaStyle: {},
        smooth: true,
        data: sysList.map((item) => item.mu),
      },
      {
        name: "全部内存",
        type: "line",
        showSymbol: false,
        // areaStyle: {},
        smooth: true,
        data: sysList.map((item) => item.mt),
      },
      {
        name: "CPU",
        type: "line",
        showSymbol: false,
        smooth: true,
        // areaStyle: {},
        yAxisIndex: 1,
        data: sysList.map((item) => item.c),
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
