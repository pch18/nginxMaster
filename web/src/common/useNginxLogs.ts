import { request } from "@/utils/request";
import useForm from "@arco-design/web-react/es/Form/useForm";
import { createGlobalStore } from "hox";
import { useRef, useState } from "react";
import { formatBytes } from "./utils";

interface SearchRule {
  host?: string[];
  method?: string;
  status?: string;
  fromIP?: string;
  ref_ua?: string;
}

const checkSearch = (rule: SearchRule, log: NginxLog) => {
  if (
    rule.host?.length &&
    !rule.host?.some((h) => log.host.includes(h.replace("*", "")))
  ) {
    return false;
  }
  if (rule.method && rule.method !== log.method) {
    return false;
  }
  if (rule.status && !log.status.toString().includes(rule.status)) {
    return false;
  }
  if (
    rule.fromIP &&
    !log.remoteAddr.includes(rule.fromIP) &&
    !log.xff.includes(rule.fromIP)
  ) {
    return false;
  }
  if (
    rule.ref_ua &&
    !log.referer.includes(rule.ref_ua) &&
    !log.ua.includes(rule.ref_ua)
  ) {
    return false;
  }
  return true;
};

export const [useNginxLog] = createGlobalStore(() => {
  const [logs, setLogs] = useState<NginxLog[]>([]);
  const logsRef = useRef<NginxLog[]>([]);
  const runningRef = useRef(false);
  const [searchForm] = useForm();

  const run = () => {
    if (runningRef.current) {
      return;
    }
    runningRef.current = true;
    const sse = request.nginxLogs(1000);
    sse.onmessage = (msg) => {
      const log = parseLog(msg.data);
      const isReverse = log.pos.charAt(0) !== "@";
      if (isReverse) {
        logsRef.current.unshift(log);
      } else {
        logsRef.current.push(log);
      }
      if (checkSearch(searchForm.getFields(), log)) {
        if (isReverse) {
          setLogs((logs) => [log, ...logs]);
        } else {
          setLogs((logs) => [...logs, log]);
        }
      }
    };
  };

  const onSearchFormChange = (rules: SearchRule) => {
    const _logs = logsRef.current.filter((log) => checkSearch(rules, log));
    setLogs(_logs);
  };

  return { logs, run, searchForm, onSearchFormChange };
});

interface NginxLog {
  pos: string;
  method: string;
  schema: string;
  host: string;
  port: number;
  uri: string;
  args: string;
  protocol: string;
  status: number;
  reqTime: number;
  reqTimeStr: string;
  reqLen: number;
  reqLenStr: string;
  respLen: number;
  respLenStr: string;
  referer: string;
  ua: string;
  remoteAddr: string;
  xff: string;
  time: Date;
  timeStr: string;
  fullUrl: string;
}

const parseLog = (raw: string): NginxLog => {
  // const [
  //   pos, 0
  //   method, 1
  //   schema,2
  //   host,3
  //   port,4
  //   uri,5
  //   args,6
  //   protocol,7
  //   status,8
  //   reqTime,9
  //   reqLen,10
  //   respLen,11
  //   referer,12
  //   ua,13
  //   remoteAddr,14
  //   xff,15
  //   time,16
  // ] = raw.split('"');
  const rs = raw.split('"');

  const pos = rs[0] || "";
  const method = !rs[1] || rs[1] === "-" ? "" : rs[1];
  const schema = !rs[2] || rs[2] === "-" ? "" : rs[2];
  const host = !rs[3] || rs[2] === "-" ? "" : rs[3];
  const port = Number(rs[4]) || 0;
  const uri = !rs[5] || rs[5] === "-" ? "" : rs[5];
  const args = !rs[6] || rs[6] === "-" ? "" : rs[6];
  const protocol = !rs[7] || rs[7] === "-" ? "" : rs[7];
  const status = Number(rs[8]) || 0;
  const reqTime = Number(rs[9]) || 0;
  const reqTimeStr = `${reqTime.toFixed(1)}s`;
  const reqLen = Number(rs[10]) || 0;
  const reqLenStr = formatBytes(reqLen);
  const respLen = Number(rs[11]) || 0;
  const respLenStr = formatBytes(respLen);
  const referer = !rs[12] || rs[12] === "-" ? "" : rs[12];
  const ua = !rs[13] || rs[13] === "-" ? "" : rs[13];
  const remoteAddr = !rs[14] || rs[14] === "-" ? "" : rs[14];
  const xff = !rs[15] || rs[15] === "-" ? "" : rs[15];
  const time = new Date(Number(rs[16]) * 1000);
  const timeStr = time.toLocaleString();

  const urlPort =
    schema === "http" && port === 80
      ? ""
      : schema === "https" && port === 443
      ? ""
      : port;
  const fullUrl = `${schema || "-"}://${host || "-"}${
    urlPort ? `:${urlPort}` : ""
  }${uri || "/"}${args ? `?${args}` : ""}`;

  return {
    pos,
    method,
    schema,
    host,
    port,
    uri,
    args,
    protocol,
    status,
    reqTime,
    reqTimeStr,
    reqLen,
    reqLenStr,
    respLen,
    respLenStr,
    referer,
    ua,
    remoteAddr,
    xff,
    time,
    timeStr,
    fullUrl,
  };
  // return {
  //   pos: rs[0]!,
  //   method: !method || method === "-" ? "" : method,
  //   schema: schema === "-" ? "" : schema,
  //   host: host === "-" ? "" : host,
  //   port: Number(port) || 0,
  //   uri: uri === "-" ? "/" : uri,
  //   url: _url,
  //   args: args === "-" ? "" : args,
  //   protocol: protocol === "-" ? "" : protocol,
  //   status: Number(status) || 0,
  //   reqTime: _reqTime,
  //   reqTimeStr: `${_reqTime.toFixed(1)}s`,
  //   reqLen: _reqLen,
  //   reqLenStr: formatBytes(_reqLen),
  //   respLen: _respLen,
  //   respLenStr: formatBytes(_respLen),
  //   referer: referer === "-" ? "" : referer,
  //   ua: ua === "-" ? "" : ua,
  //   remoteAddr: remoteAddr === "-" ? "" : remoteAddr,
  //   xff: xff === "-" ? "" : xff,
  //   time: _time,
  //   timeStr: _time.toLocaleString(),
  // };
};
