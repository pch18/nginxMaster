import { request } from "@/utils/request";
import { useRequest } from "ahooks";
import { createGlobalStore } from "hox";
import { useState } from "react";

export const [useNginxLog] = createGlobalStore(() => {
  const [logs, setLogs] = useState<NginxLog[]>([]);
  useRequest(
    async () => {
      const sse = await request.nginxLogs();
      sse.onmessage = (msg) => {
        const log = parseLog(msg.data);
        setLogs((l) => [log, ...l]);
      };
    },
    {
      ready: location.pathname !== "/login",
    }
  );
  return logs;
});

interface NginxLog {
  method: string;
  schema: string;
  host: string;
  port: number;
  uri: string;
  args: string;
  protocol: string;
  status: number;
  reqTime: number;
  reqLen: number;
  respLen: number;
  referer: string;
  ua: string;
  remoteAddr: string;
  xff: string;
  time: Date;
  timeStr: string;
}

const parseLog = (raw: string): NginxLog => {
  const [
    method = "",
    schema = "",
    host = "",
    port = "",
    uri = "",
    args = "",
    protocol = "",
    status = "",
    reqTime = "",
    reqLen = "",
    respLen = "",
    referer = "",
    ua = "",
    remoteAddr = "",
    xff = "",
    time = "",
  ] = raw.split('"');

  const date = new Date(Number(time) * 1000);
  return {
    method: method === "-" ? "" : method,
    schema: schema === "-" ? "" : schema,
    host: host === "-" ? "" : host,
    port: Number(port) || 0,
    uri: uri === "-" ? "" : uri,
    args: args === "-" ? "" : `?${args}`,
    protocol: protocol === "-" ? "" : protocol,
    status: Number(status) || 0,
    reqTime: Number(reqTime) * 1000 || 0,
    reqLen: Number(reqLen) || 0,
    respLen: Number(respLen) || 0,
    referer: referer === "-" ? "" : referer,
    ua: ua === "-" ? "" : ua,
    remoteAddr: remoteAddr === "-" ? "" : remoteAddr,
    xff: xff === "-" ? "" : xff,
    time: date,
    timeStr: date.toLocaleString(),
  };
};
