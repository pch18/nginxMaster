import { Tag } from "@arco-design/web-react";
import { type FC } from "react";
import {
  type EasLogLevel,
  EasLogLevelIconMap,
  EasLogLevelColorMap,
} from "../interface";

export const LevelTag: FC<{
  level: EasLogLevel;
  className?: string;
  border?: boolean;
}> = ({ level, className, border }) => {
  const Icon = EasLogLevelIconMap[level];
  return (
    <Tag
      className={className}
      style={{
        borderColor: EasLogLevelColorMap[level],
        color: border ? EasLogLevelColorMap[level] : "#fff",
        backgroundColor: border
          ? `${EasLogLevelColorMap[level]}33`
          : EasLogLevelColorMap[level],
      }}
    >
      <div className="flex items-center">
        <Icon className="text-lg mr-1" />
        {level}
      </div>
    </Tag>
  );
};
