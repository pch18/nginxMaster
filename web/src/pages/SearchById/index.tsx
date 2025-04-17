import { Button, Input, Message, Tabs } from "@arco-design/web-react";
import { useState } from "react";
import { checkTrace } from "./utils";
import { TraceIdResult } from "@/common/TraceIdResult";

export default function () {
  const [traceId, setTraceId] = useState("8z0gon02bo7javo7");

  const [tabs, setTabs] = useState<string[]>(["8z0gon02bo7javo7"]);

  const [activeTab, setActiveTab] = useState("8z0gon02bo7javo7");

  const handleSearch = () => {
    if (!checkTrace(traceId)) {
      Message.error({
        content: "Trace ID 格式错误",
        duration: 800,
      });
      return;
    }
    setTabs((_t) => {
      if (!_t.includes(traceId)) {
        return [..._t, traceId];
      }
      return _t;
    });
    setActiveTab(traceId);
    setTraceId("");
  };

  return (
    <div className="p-4 size-full flex flex-col">
      <div className="flex gap-4 mb-4">
        <Input
          maxLength={16}
          className="h-12 font-bold !text-2xl tracking-widest font-mono"
          value={traceId}
          onChange={setTraceId}
          placeholder="请输入要查询的 Trace ID"
          onPressEnter={handleSearch}
        />
        <Button className="!h-12 !px-7 !text-xl " onClick={handleSearch}>
          搜索
        </Button>
      </div>

      <Tabs
        activeTab={activeTab}
        onChange={setActiveTab}
        tabPosition="left"
        className="font-mono flex-1"
        css={`
          .arco-tabs-content {
            overflow: auto;
          }
          .arco-tabs-content-item {
            overflow: visible;
          }
        `}
      >
        {tabs.map((tab) => (
          <Tabs.TabPane
            key={tab}
            title={<div className="w-[68px] break-words text-wrap">{tab}</div>}
          >
            <TraceIdResult traceId={tab} />
          </Tabs.TabPane>
        ))}
      </Tabs>
    </div>
  );
}
