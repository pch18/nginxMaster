import { request } from "@/utils/request";
import useForm from "@arco-design/web-react/es/Form/useForm";
import { createGlobalStore } from "hox";
import { useRef, useState } from "react";

interface SearchRule {
  host?: string[];
  method?: string;
  status?: string;
  fromIP?: string;
  ref_ua?: string;
}

const checkSearch = (rule: SearchRule, log: NginxLog) => {
  if (rule.host?.length && !rule.host.includes(log.host.replace("*", ""))) {
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
    const sse = request.nginxLogs();
    sse.onmessage = (msg) => {
      const log = parseLog(msg.data);
      logsRef.current.unshift(log);
      if (checkSearch(searchForm.getFields(), log)) {
        setLogs((logs) => [log, ...logs]);
      }
    };
  };

  const onSearchFormChange = (rules: SearchRule) => {
    console.log(logsRef.current);
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
}

const parseLog = (raw: string): NginxLog => {
  const [
    pos = "",
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

  const _time = new Date(Number(time) * 1000);
  const _reqTime = Number(reqTime) || 0;
  const _reqLen = Number(reqLen) || 0;
  const _respLen = Number(respLen) || 0;

  return {
    pos,
    method: method === "-" ? "" : method,
    schema: schema === "-" ? "" : schema,
    host: host === "-" ? "" : host,
    port: Number(port) || 0,
    uri: uri === "-" ? "" : uri,
    args: args === "-" ? "" : `?${args}`,
    protocol: protocol === "-" ? "" : protocol,
    status: Number(status) || 0,
    reqTime: _reqTime,
    reqTimeStr: `${_reqTime.toFixed(1)}s`,
    reqLen: _reqLen,
    reqLenStr: formatBytes(_reqLen),
    respLen: _respLen,
    respLenStr: formatBytes(_respLen),
    referer: referer === "-" ? "" : referer,
    ua: ua === "-" ? "" : ua,
    remoteAddr: remoteAddr === "-" ? "" : remoteAddr,
    xff: xff === "-" ? "" : xff,
    time: _time,
    timeStr: _time.toLocaleString(),
  };
};

const formatBytes = (bytes: number) => {
  if (bytes === 0) {
    return "0B";
  }
  const k = 1024;
  const sizes = ["B", "K", "M", "G", "T"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), 4);
  const formattedBytes = (bytes / Math.pow(k, i)).toFixed(1);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return `${formattedBytes}${sizes[i]!}`;
};
