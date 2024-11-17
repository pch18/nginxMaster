import React from "react";

interface PropsControlledConvert<InData, OutData> {
  input: (outData: OutData | undefined) => InData | undefined;
  output: (inData: InData | undefined) => OutData | undefined;
  value?: OutData;
  onChange?: (outData: OutData | undefined) => void;
  children: React.ReactElement;
}

export const ControlledConverter = <InData, OutData>(
  props: PropsControlledConvert<InData, OutData>
) => {
  const { input, output, value, onChange, children, ...otherProps } = props;
  const cloneChild = React.cloneElement(children, {
    value: input(value),
    onChange: (inData: InData | undefined) => onChange?.(output(inData)),
    ...otherProps,
  });
  return cloneChild;
};
