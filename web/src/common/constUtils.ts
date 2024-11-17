import { useMemo } from "react";

export type ConstOptionMap<
  K extends PropertyKey,
  // eslint-disable-next-line @typescript-eslint/ban-types
  T extends Record<string, any> = {}
> = Record<K, ConstOption<K, T>>;

export type ConstOption<
  K extends PropertyKey,
  // eslint-disable-next-line @typescript-eslint/ban-types
  T extends Record<string, any> = {}
> = {
  label: string;
  value: K;
  hidden?: boolean;
  rank?: number;
} & T;

export interface Option {
  value: string;
  label: string;
}

export const genConstOption = <
  K extends PropertyKey,
  // eslint-disable-next-line @typescript-eslint/ban-types
  T extends Record<string, any> = {}
>(
  c: ConstOptionMap<K, T>,
  filter?: (obj: ConstOption<K, T>) => boolean
): Array<ConstOption<K, T>> =>
  Object.values<ConstOption<K, T>>(c)
    .filter((f) => !f.hidden && (!filter || filter(f)))
    .sort((a, b) => {
      if (b.rank !== undefined && a.rank === undefined) {
        return -1;
      }
      if (b.rank === undefined && a.rank !== undefined) {
        return 1;
      }
      if (b.rank !== undefined && a.rank !== undefined) {
        return b.rank - a.rank;
      }
      return Number(a.value) - Number(b.value);
    }) as any;

export const useConstOption = <
  K extends PropertyKey,
  // eslint-disable-next-line @typescript-eslint/ban-types
  T extends Record<string, any> = {}
>(
  c: ConstOptionMap<K, T>,
  filter?: (obj: ConstOption<K, T>) => boolean
): Array<ConstOption<K, T>> =>
  useMemo(() => {
    const res = genConstOption(c, filter);
    return res;
  }, []);
