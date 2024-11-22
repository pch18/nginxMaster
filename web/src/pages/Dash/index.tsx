import { Logs } from "./Logs";
import { LogsSearch } from "./LogsSearch";

export default function () {
  return (
    <div className="p-5 h-full flex flex-col overflow-hidden">
      <div className="flex-none font-bold text-2xl mb-2">访问日志</div>
      <LogsSearch />
      <Logs className="flex-auto overflow-hidden" />
    </div>
  );
}
