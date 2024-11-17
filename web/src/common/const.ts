import { type ConstOptionMap } from "./constUtils";
import { LocationRedirectCode, LocationMode } from "./interface";

export const ConstMapLocationMode: ConstOptionMap<
  LocationMode,
  { color: string }
> = {
  [LocationMode.Static]: {
    value: LocationMode.Static,
    label: "静态资源",
    color: "arcoblue",
    rank: 9,
  },
  [LocationMode.Proxy]: {
    value: LocationMode.Proxy,
    label: "反向代理",
    color: "green",
    rank: 8,
  },
  [LocationMode.Redirect]: {
    value: LocationMode.Redirect,
    label: "重定向",
    color: "orangered",
    rank: 7,
  },
  [LocationMode.Custom]: {
    value: LocationMode.Custom,
    label: "自定义",
    color: "magenta",
    rank: 6,
  },
};

export const ConstMapLocationRedirectCode: ConstOptionMap<LocationRedirectCode> =
  {
    [LocationRedirectCode.Code301]: {
      value: LocationRedirectCode.Code301,
      label: "永久301",
      rank: 9,
    },
    [LocationRedirectCode.Code302]: {
      value: LocationRedirectCode.Code302,
      label: "临时302",
      rank: 8,
    },
    [LocationRedirectCode.Code307]: {
      value: LocationRedirectCode.Code307,
      label: "永久307",
      rank: 7,
    },
    [LocationRedirectCode.Code308]: {
      value: LocationRedirectCode.Code308,
      label: "临时308",
      rank: 6,
    },
  };
