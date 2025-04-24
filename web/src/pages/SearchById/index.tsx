import { Button, Input, Message, Tabs } from "@arco-design/web-react";
import { useState } from "react";
import { checkTrace } from "./utils";
import { TraceIdResult } from "@/common/TraceIdResult";

export default function () {
  const [traceId, setTraceId] = useState("8z0gon02bo7javo7");

  const [tabs, setTabs] = useState<string[]>(["8z0gon02bo7javo7"]);

  const [activeTab, setActiveTab] = useState("8z0gon02bo7javo7");
  const [refreshKey, setRefreshKey] = useState<Record<string, number>>({});

  const handleSearch = () => {
    if (!checkTrace(traceId)) {
      return;
    }
    setTabs((_t) => {
      if (!_t.includes(traceId)) {
        return [..._t, traceId];
      }
      return _t;
    });
    setActiveTab(traceId);
    setRefreshKey((_k) => ({ ..._k, [traceId]: (_k[traceId] || 0) + 1 }));
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
          onFocus={(e) => {
            e.target.selectionStart = 0;
            e.target.selectionEnd = e.target.value.length;
          }}
        />
        <Button
          className="!h-12 !px-7 !text-xl "
          onClick={handleSearch}
          disabled={!checkTrace(traceId)}
        >
          {tabs.includes(traceId) ? "刷新" : "搜索"}
        </Button>
      </div>

      <Tabs
        activeTab={activeTab}
        onChange={setActiveTab}
        onClickTab={setTraceId}
        tabPosition="left"
        className="font-mono flex-1"
        css={`
          .arco-tabs-content {
            overflow: auto;
          }
          .arco-tabs-content-item-active {
            overflow: visible;
          }
        `}
      >
        {tabs.map((tab) => (
          <Tabs.TabPane
            key={tab}
            title={<div className="w-[68px] text-wrap break-all">{tab}</div>}
          >
            <TraceIdResult traceId={tab} key={refreshKey[tab]} />
          </Tabs.TabPane>
        ))}
      </Tabs>
    </div>
  );
}
