import { Badge, Button, Checkbox, Icon, Tag } from "@arco-design/web-react";
import {
  EasLogLevel,
  EasLogLevelColorMap,
  EasLogLevelIconMap,
  type EasLog,
} from "../interface";
import { useMemo, type FC } from "react";
import clsx from "clsx";
import { LevelTag } from "./LevelTag";

export const ToolBar: FC<{
  logs: EasLog[];
  filterLevels: EasLogLevel[];
  setFilterLevels: (l: EasLogLevel[]) => void;
  className?: string;
}> = ({ logs, filterLevels, setFilterLevels, className }) => {
  const options = useMemo(
    () => Object.keys(EasLogLevelColorMap) as EasLogLevel[],
    []
  );

  const countMapLevel = useMemo(() => {
    const map: Record<EasLogLevel, number> = {
      [EasLogLevel.Debug]: 0,
      [EasLogLevel.Info]: 0,
      [EasLogLevel.Warn]: 0,
      [EasLogLevel.Error]: 0,
      [EasLogLevel.Fatal]: 0,
      [EasLogLevel.Panic]: 0,
    };
    logs.forEach((l) => map[l.level]++);
    return map;
  }, [logs]);

  return (
    <div className="flex justify-between items-center">
      <div className={clsx("flex items-center", className)}>
        <Checkbox.Group onChange={setFilterLevels} value={filterLevels}>
          {options.map((item) => {
            return (
              <Checkbox key={item} value={item} className="!mr-1">
                {({ checked }) => {
                  return (
                    <Badge count={countMapLevel[item]}>
                      <LevelTag
                        border
                        level={item}
                        className={clsx(checked ? "" : "opacity-30")}
                      />
                    </Badge>
                  );
                }}
              </Checkbox>
            );
          })}
        </Checkbox.Group>
        <Button
          className="ml-1"
          onClick={() => {
            setFilterLevels([]);
          }}
          size="mini"
        >
          重置
        </Button>
      </div>
      <div />
    </div>
  );
};
