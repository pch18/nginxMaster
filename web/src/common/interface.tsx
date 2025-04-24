import {
  IconBug,
  IconCloseCircle,
  IconCloseCircleFill,
  IconExclamationCircle,
  IconFaceFrownFill,
  IconMinusCircle,
  IconMinusCircleFill,
  IconPoweroff,
  IconThumbDownFill,
} from "@arco-design/web-react/icon";
import type dayjs from "dayjs";

export interface EasTrace {
  id: string;
  createdat: string;
  proclist: string;
  prockey: string;
  userid: string;
}

export interface EasLog {
  _id: string;
  num: number;
  traceid: string;
  trace: EasTrace;

  app: string;
  srv: string;
  level: EasLogLevel;
  stack: string[];
  time: number;

  kind: EasLogKind;
  data: EasLog_Common;
}

export enum EasLogLevel {
  Debug = "Debug",
  Info = "Info",
  Warn = "Warn",
  Error = "Error",
  Fatal = "Fatal",
  Panic = "Panic",
}

export const EasLogLevelIconMap = {
  [EasLogLevel.Debug]: IconBug,
  [EasLogLevel.Info]: IconExclamationCircle,
  [EasLogLevel.Warn]: IconMinusCircleFill,
  [EasLogLevel.Error]: IconCloseCircleFill,
  [EasLogLevel.Fatal]: IconThumbDownFill,
  [EasLogLevel.Panic]: IconFaceFrownFill,
};

export const EasLogLevelColorMap = {
  [EasLogLevel.Debug]: "#7EB712",
  [EasLogLevel.Info]: "#1FA6AA",
  [EasLogLevel.Warn]: "#FF7D00",
  [EasLogLevel.Error]: "#F53F3F",
  [EasLogLevel.Fatal]: "#3491FA",
  [EasLogLevel.Panic]: "#8E51DA",
};

export enum EasLogKind {
  Default = "Default",
  GrpcClient = "Grpc-Client",
  GrpcServer = "Grpc-Server",
  Gin = "Gin",
  Gorm = "Gorm",
  Mongo = "Mongo",
  Amq = "Amq",
  Rmq = "Rmq",
}

export const EasLogKindColorMap = {
  [EasLogKind.Default]: "#86909c",
  [EasLogKind.GrpcClient]: "#0fc6c2",
  [EasLogKind.GrpcServer]: "#168cff",
  [EasLogKind.Gin]: "#eb0aa4",
  [EasLogKind.Gorm]: "#7816ff",
  [EasLogKind.Mongo]: "#8E51DA",
  [EasLogKind.Amq]: "#8E51DA",
  [EasLogKind.Rmq]: "#8E51DA",
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface EasLog_Common {}

export interface EasLog_Default extends EasLog_Common {
  msg: string;
}

export interface EasLog_GrpcClient extends EasLog_Common {
  name: string;
  call: string;

  // 以下是请求才有的
  startKey?: string;
  req?: any;

  // 以下是返回才有的
  endKey?: string;
  elapsed?: number;
  error?: string;
  resp?: any;
}

export interface EasLog_GrpcServer extends EasLog_Common {
  name: string;
  call: string;
  from: string;

  // 以下是请求才有的
  startKey?: string;
  req?: any;

  // 以下是返回才有的
  endKey?: string;
  elapsed?: number;
  error?: string;
  resp?: any;
}

export interface EasLog_Gin extends EasLog_Common {
  name: string;
  method: string;
  path: string;
  from: string;

  // 以下是请求才有的
  startKey?: string;
  header?: Record<string, string>;
  req?: any;

  // 以下是返回才有的
  endKey?: string;
  status?: number;
  elapsed?: number;
  errors?: string[];
  resp?: any;
}

export interface EasLog_Gorm extends EasLog_Common {
  sql: string;
  rows: number;
  duration: number;
  error: string;
}

export interface EasLog_Mongo extends EasLog_Common {
  // msg: string;
}

export interface EasLog_Amq extends EasLog_Common {
  // msg: string;
}

export interface EasLog_Rmq extends EasLog_Common {
  // msg: string;
}
