import { request } from "@/utils/request";
import { useRequest } from "ahooks";
import { useMemo } from "react";
import { createGlobalStore } from "hox";

export const [useSiteList] = createGlobalStore(() => {
  const req = useRequest(async () => {
    const { list } = await request.ListSite();
    return list;
  });
  const sortedList = useMemo(() => {
    return req.data?.sort((a, b) => (a.id < b.id ? 1 : -1)) || [];
  }, [req.data]);

  return { sortedList, ...req };
});

export const [useCertList] = createGlobalStore(() => {
  const req = useRequest(async () => {
    const { list } = await request.ListCert(true);
    return list;
  });
  const sortedList = useMemo(() => {
    return req.data?.sort((a, b) => (a.id < b.id ? 1 : -1)) || [];
  }, [req.data]);
  const certMapId = useMemo(() => {
    return Object.fromEntries(req.data?.map((item) => [item.id, item]) || []);
  }, [req.data]);
  return { sortedList, certMapId, ...req };
});
