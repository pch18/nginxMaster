import { Select } from '@arco-design/web-react';
import { SelectProps } from '@arco-design/web-react/es/Select/interface';
import React, { useMemo } from 'react';

type PropsSelectObjectMultiple<T = any> = {
  /** 受控模式输入 */
  value?: T[];
  /** 受控模式输出 */
  onChange?: (value: T[]) => void;
  /** 对象中提取key的方法 */
  getKey: (v: T) => string | number;
  /** 对象中提取回显字符的方法 */
  getLabel: (v: T) => string;
  /** (非必填)判断对象是否禁用的方法(如果初始candidates中无此条目,仅在value中有的话,可能不生效 */
  getOptionDisabled?: (v: T) => boolean;
  /** 下拉框候选项 */
  candidates: T[];
  /** 处于展示模式 */
  inViewMode?: boolean;
  /** ref传递到实际Select组件上 */
  ref?: any;
} & Omit<SelectProps, 'value' | 'onChange' | 'options' | 'mode'>;

const SelectObjectMultipleNotRef = <T extends unknown>(
  props: PropsSelectObjectMultiple<T>,
  ref: any,
) => {
  const {
    value,
    onChange,
    getLabel,
    getKey,
    getOptionDisabled,
    candidates,
    inViewMode,
    ...otherProps
  } = props;

  const selectOptions = useMemo(
    () =>
      candidates.map(c => {
        const disabled = getOptionDisabled?.(c);
        return {
          value: getKey(c),
          label: getLabel(c),
          disabled,
        };
      }),
    [getLabel, getKey, candidates],
  );

  const allDict = useMemo(
    () =>
      Object.fromEntries(
        candidates.concat(value || []).map(c => {
          const key = getKey(c);
          return [
            key,
            {
              value: key,
              label: getLabel(c),
              content: c,
            },
          ];
        }),
      ),
    [getLabel, getKey, candidates, value],
  );

  if (inViewMode) {
    return <span>{value?.map(getLabel).join('、') ?? '-'}</span>;
  }

  return (
    <Select
      ref={ref}
      {...otherProps}
      mode="multiple"
      value={Array.from(new Set(value?.map(v => getKey(v).toString()) || []))}
      onChange={(keys?: string[]) =>
        onChange?.(keys?.map(key => allDict[key].content) || [])
      }
      options={selectOptions}
      renderFormat={(_, selectKey) => `${allDict[selectKey as string]?.label}`}
    />
  );
};

export const SelectObjectMultiple = React.forwardRef(
  SelectObjectMultipleNotRef,
) as typeof SelectObjectMultipleNotRef;
