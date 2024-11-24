import { Graph } from "./Graph";
import { Logs } from "./Logs";
import { LogsTitle } from "./LogsTitle";

export default function () {
  return (
    <div className="p-4 h-full flex flex-col overflow-hidden">
      <Graph />
      <LogsTitle />
      <Logs className="flex-auto overflow-hidden" />
    </div>
  );
}
