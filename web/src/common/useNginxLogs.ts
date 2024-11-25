import { request } from "@/utils/request";
import useForm from "@arco-design/web-react/es/Form/useForm";
import { createGlobalStore } from "hox";
import { useEffect, useRef, useState } from "react";
import { formatBytes } from "./utils";
import { useGetState } from "ahooks";

interface SearchRule {
  fullUrl?: string;
  method?: string;
  status?: string;
  fromIP?: string;
  ref_ua?: string;
}

const ruleFormat = (rule: SearchRule): SearchRule => {
  return {
    fullUrl: rule?.fullUrl?.trim().toLowerCase(),
    method: rule?.method?.trim().toLowerCase(),
    status: rule?.status?.trim(),
    fromIP: rule?.fromIP?.trim(),
    ref_ua: rule?.ref_ua?.trim().toLowerCase(),
  };
};

const checkSearch = (rule: SearchRule, log: NginxLog) => {
  if (rule.fullUrl && !log.fullUrl.toLowerCase().includes(rule.fullUrl)) {
    return false;
  }
  if (rule.method && !log.method.toLowerCase().includes(rule.method)) {
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
    !log.referer.toLowerCase().includes(rule.ref_ua) &&
    !log.ua.toLowerCase().includes(rule.ref_ua)
  ) {
    return false;
  }
  return true;
};

export const [useNginxLog] = createGlobalStore(() => {
  const runningRef = useRef(false);
  const [searchRule, setSearchRule, getSearchRule] = useGetState<SearchRule>(
    {}
  );

  const logsRef = useRef<NginxLog[]>([]);
  const [logs, setLogs] = useState<NginxLog[]>([]);
  useEffect(() => {
    const _rules = ruleFormat(searchRule);
    const _logs = logsRef.current.filter((log) => checkSearch(_rules, log));
    setLogs(_logs);
  }, [searchRule]);

  const run = () => {
    if (runningRef.current) {
      return;
    }
    runningRef.current = true;
    const sse = request.nginxLogs(2000);
    sse.onmessage = (msg) => {
      const log = parseLog(msg.data);
      const isReverse = log.pos.charAt(0) !== "@";
      if (isReverse) {
        logsRef.current.unshift(log);
      } else {
        logsRef.current.push(log);
      }
      const rule = ruleFormat(getSearchRule());
      if (checkSearch(rule, log)) {
        if (isReverse) {
          setLogs((logs) => [log, ...logs]);
        } else {
          setLogs((logs) => [...logs, log]);
        }
      }
    };
  };

  return { logs, run, setSearchRule, searchRule };
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
  statusCor: string;
  reqTimeCor: string;
  reqLenCor: string;
  respLenCor: string;
}

const parseLog = (raw: string): NginxLog => {
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
  const statusCor =
    status >= 200 && status < 300
      ? "var(--color-ok)"
      : status >= 300 && status < 400
      ? "var(--color-warm)"
      : "var(--color-err)";
  const reqTime = Number(rs[9]) || 0;
  const reqTimeStr =
    reqTime < 1
      ? `${(reqTime * 1000).toFixed(0)} ms`
      : `${reqTime.toFixed(reqTime < 10 ? 2 : reqTime < 100 ? 1 : 0)} s`;
  const reqTimeCor =
    reqTime < 0.2
      ? "var(--color-ok)"
      : reqTime < 1
      ? "var(--color-warm)"
      : "var(--color-err)";
  const reqLen = Number(rs[10]) || 0;
  const reqLenStr = formatBytes(reqLen);
  const reqLenCor =
    reqLen < 204800
      ? "var(--color-ok)"
      : reqLen < 1048576
      ? "var(--color-warm)"
      : "var(--color-err)";
  const respLen = Number(rs[11]) || 0;
  const respLenStr = formatBytes(respLen);
  const respLenCor =
    respLen < 204800
      ? "var(--color-ok)"
      : respLen < 1048576
      ? "var(--color-warm)"
      : "var(--color-err)";
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
    statusCor,
    reqTimeCor,
    reqLenCor,
    respLenCor,
  };
};
