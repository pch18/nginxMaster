import { Select } from "@arco-design/web-react";
import { type SelectProps } from "@arco-design/web-react/es/Select/interface";
import React, { useMemo } from "react";

type PropsSelectObject<T = any> = {
  value?: T;
  onChange?: (value?: T) => void;
  getLabel: (v: T) => string;
  getKey: (v: T) => string | number;
  candidates: T[];
  /** 处于展示模式 */
  inViewMode?: boolean;
  ref?: any;
} & Omit<SelectProps, "value" | "onChange" | "options" | "mode">;

const SelectObjectNotRef = <T extends unknown>(
  props: PropsSelectObject<T>,
  ref: any
) => {
  const {
    value,
    onChange,
    getLabel,
    getKey,
    candidates,
    inViewMode,
    ...otherProps
  } = props;

  const selectOptions = useMemo(
    () =>
      candidates.map((c) => ({
        value: getKey(c),
        label: getLabel(c),
      })),
    [getLabel, getKey, candidates]
  );

  const allDict = useMemo(
    () =>
      Object.fromEntries(
        candidates.concat(value ? [value] : []).map((c) => [
          getKey(c),
          {
            value: getKey(c),
            label: getLabel(c),
            content: c,
          },
        ])
      ),
    [getLabel, getKey, candidates, value]
  );

  if (inViewMode) {
    return <span>{(value && getLabel(value)) ?? "-"}</span>;
  }

  return (
    <Select
      ref={ref}
      {...otherProps}
      mode={undefined}
      value={value !== undefined ? getKey(value) : undefined}
      onChange={(key?: string) =>
        onChange?.(key === undefined ? undefined : allDict[key]?.content)
      }
      options={selectOptions}
      renderFormat={(selectOption, selectKey) =>
        selectOption?.children ||
        (value && getKey(value) === selectKey ? getLabel(value) : null)
      }
    />
  );
};

export const SelectObject = React.forwardRef(
  SelectObjectNotRef
) as typeof SelectObjectNotRef;
