import { type FC, type ReactNode } from "react";
import {
  type EasLog_Default,
  EasLogKind,
  type EasLog,
  type EasLog_GrpcClient,
  type EasLog_GrpcServer,
  type EasLog_Gin,
  type EasLog_Gorm,
  type EasLog_Mongo,
  type EasLog_Amq,
  type EasLog_Rmq,
} from "../interface";
import ReactJson, { type ReactJsonViewProps } from "react-json-view";
import { useDarkMode } from "../useDarkMode";
import styled from "styled-components";
import clsx from "clsx";

export const logPreviewString = (log: EasLog): string => {
  let data;
  switch (log.kind) {
    case EasLogKind.Default:
      data = log.data as EasLog_Default;
      return data.msg;
    case EasLogKind.GrpcClient:
      data = log.data as EasLog_GrpcClient;
      return `${data.endKey ? `[${data.elapsed?.toFixed(2)}ms] ` : ""}${
        data.call
      }`;
    case EasLogKind.GrpcServer:
      data = log.data as EasLog_GrpcServer;
      return `${data.endKey ? `[${data.elapsed?.toFixed(2)}ms] ` : ""}${
        data.call
      }`;
    case EasLogKind.Gin:
      data = log.data as EasLog_Gin;
      return `${data.endKey ? `[${data.elapsed?.toFixed(2)}ms] ` : ""} ${
        data.method
      } ${data.path}`;
    case EasLogKind.Gorm:
      data = log.data as EasLog_Gorm;
      return `[${data.duration.toFixed(2)}ms] ${data.sql}`;
    case EasLogKind.Mongo:
      data = log.data as EasLog_Mongo;
      return "";
    case EasLogKind.Amq:
      data = log.data as EasLog_Amq;
      return "";
    case EasLogKind.Rmq:
      data = log.data as EasLog_Rmq;
      return "";
    default:
      return "";
  }
};

export const LogDataViewer: FC<{ log: EasLog }> = ({ log }): ReactNode => {
  let data;
  switch (log.kind) {
    case EasLogKind.Default:
      data = log.data as EasLog_Default;
      return <Block>{data.msg}</Block>;
    case EasLogKind.GrpcClient:
      data = log.data as EasLog_GrpcClient;
      if (data.startKey) {
        return (
          <>
            <Field name="服务">{data.name}</Field>
            <Field name="方法">{data.call}</Field>
            <Field name="内容">
              {data.req ? <JsonViewer src={data.req} collapsed={1} /> : "无"}
            </Field>
          </>
        );
      } else if (data.endKey) {
        return (
          <>
            <Field name="服务">{data.name}</Field>
            <Field name="方法">{data.call}</Field>
            <Field name="耗时">{data.elapsed}ms</Field>
            <Field name="错误">
              {data.error ? <Block>{data.error}</Block> : "无"}
            </Field>
            <Field name="内容">
              {data.resp ? <JsonViewer src={data.resp} collapsed={1} /> : "无"}
            </Field>
          </>
        );
      }
      return null;
    case EasLogKind.GrpcServer:
      data = log.data as EasLog_GrpcServer;
      if (data.startKey) {
        return (
          <>
            <Field name="来源">{data.from}</Field>
            <Field name="服务">{data.name}</Field>
            <Field name="方法">{data.call}</Field>
            <Field name="内容">
              {data.req ? <JsonViewer src={data.req} collapsed={1} /> : "无"}
            </Field>
          </>
        );
      } else if (data.endKey) {
        return (
          <>
            <Field name="来源">{data.from}</Field>
            <Field name="服务">{data.name}</Field>
            <Field name="方法">{data.call}</Field>
            <Field name="耗时">{data.elapsed}ms</Field>
            <Field name="错误">
              {data.error ? <Block>{data.error}</Block> : "无"}
            </Field>
            <Field name="内容">
              {data.resp ? <JsonViewer src={data.resp} collapsed={1} /> : "无"}
            </Field>
          </>
        );
      }
      return null;
    case EasLogKind.Gin:
      data = log.data as EasLog_Gin;
      if (data.startKey) {
        return (
          <>
            <Field name="来源">{data.from}</Field>
            <Field name="服务">{data.name}</Field>
            <Field name="方法">{data.method}</Field>
            <Field name="路径">{data.path}</Field>
            <Field name="头部">
              {data.header ? (
                <JsonViewer src={data.header} collapsed={0} />
              ) : (
                "无"
              )}
            </Field>
            <Field name="内容">
              {data.req ? <JsonViewer src={data.req} collapsed={1} /> : "无"}
            </Field>
          </>
        );
      } else if (data.endKey) {
        return (
          <>
            <Field name="来源">{data.from}</Field>
            <Field name="服务">{data.name}</Field>
            <Field name="方法">{data.method}</Field>
            <Field name="路径">{data.path}</Field>
            <Field name="耗时">{data.elapsed}ms</Field>
            <Field name="错误">
              {data.errors?.length
                ? data.errors.map((e, i) => <Block key={i}>{e}</Block>)
                : "无"}
            </Field>
            <Field name="内容">
              {data.resp ? <JsonViewer src={data.resp} collapsed={1} /> : "无"}
            </Field>
          </>
        );
      }
      return null;
    case EasLogKind.Gorm:
      data = log.data as EasLog_Gorm;
      return (
        <>
          <Field name="影响">{data.rows}行</Field>
          <Field name="耗时">{data.duration}ms</Field>
          <Field name="错误">
            {data.error ? <Block>{data.error}</Block> : "无"}
          </Field>
          <Field name="语句">
            <Block>{data.sql}</Block>
          </Field>
        </>
      );
    case EasLogKind.Mongo:
      data = log.data as EasLog_Mongo;
      return "";
    case EasLogKind.Amq:
      data = log.data as EasLog_Amq;
      return "";
    case EasLogKind.Rmq:
      data = log.data as EasLog_Rmq;
      return "";
    default:
      return "";
  }
};

const Block = styled.div`
  border-width: 1px;
  border-radius: 0.5rem /* 8px */;
  padding: 0.5rem /* 8px */;
  background-color: var(--color-bg-4);
  white-space: pre-wrap;
`;

export const Field: FC<{ name: string; children: ReactNode }> = ({
  name,
  children,
}) => {
  return (
    <div className="flex mt-1">
      <div className="font-bold flex-none">{name}:</div>
      <div className="ml-2 flex-auto">{children}</div>
    </div>
  );
};

export const JsonViewer: FC<
  ReactJsonViewProps & {
    className?: string;
  }
> = ({ className, ...props }) => {
  const [isDark] = useDarkMode();
  return (
    <div className={clsx(className, "bg-color-bg-4 border rounded-lg p-2")}>
      <ReactJson
        collapsed={1}
        name={null}
        displayDataTypes={false}
        theme={isDark ? "monokai" : "rjv-default"}
        {...props}
      />
    </div>
  );
};
