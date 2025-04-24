import { useMemo, type FC } from "react";
import { getColor, type Proc } from "./utils";
import clsx from "clsx";
import { useDarkMode } from "../useDarkMode";
import { Badge, Popover } from "@arco-design/web-react";

export const GraphProc: FC<{
  procList: Proc[];
  className?: string;
  select: Set<string>;
  handleSelect: (key: string | undefined) => void;
}> = ({ procList, className, select, handleSelect }) => {
  return (
    <div
      className={clsx(className)}
      onClick={() => {
        handleSelect(undefined);
      }}
    >
      <Node
        procList={procList}
        parentKey=""
        select={select}
        handleSelect={handleSelect}
      />
    </div>
  );
};

const Node: FC<{
  procList: Proc[];
  parentKey: string;
  select: Set<string>;
  handleSelect: (key: string | undefined) => void;
}> = ({ procList, parentKey, select, handleSelect }) => {
  const list = useMemo(
    () => procList.filter((s) => s.parentKey === parentKey),
    [procList, parentKey]
  );
  const [isDark] = useDarkMode();

  return (
    <div className="flex gap-2">
      {list.map((s) => (
        <div key={s.key} style={{ flex: s.width || 1 }} className="min-w-0">
          {/* <Popover
            // popupHoverStay={false}
            triggerProps={{
              alignPoint: true,
              mouseLeaveDelay: 0,
              mouseEnterDelay: 0,
            }}
            content={
              <div>
                <div className="font-bold">
                  {s.app} / {s.srv}
                </div>
                <div>{s.name}</div>
              </div>
            }
          > */}
          <div
            className={clsx(
              "px-1 mb-2 hover:opacity-80 cursor-pointer relative",
              {
                "opacity-25": select.size && !select.has(s.key),
              }
            )}
            style={{ backgroundColor: getColor(s.srvInd, isDark) }}
            onClick={(e) => {
              e.stopPropagation();
              handleSelect(s.key);
            }}
          >
            <div className="h-0 w-fit absolute right-0 top-0">
              <Badge count={s.logs.length} />
            </div>
            <div className="truncate text-center">
              {s.srv}/{s.name}
            </div>
          </div>
          {/* </Popover> */}
          <Node
            procList={procList}
            parentKey={s.key}
            select={select}
            handleSelect={handleSelect}
          />
        </div>
      ))}
    </div>
  );
};
