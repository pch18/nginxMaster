import React from "react";

export const ControlledInheritor: React.FC<{
  children: React.ReactElement | ((props: any) => React.ReactElement);
  [x: string]: any;
}> = ({ children, ...otherProps }) => {
  if (isReactElement(children)) {
    const othterEvent: Record<string, () => any> = {};

    if (children.props.onClick && otherProps.onClick) {
      othterEvent.onClick = async (...args) => {
        await otherProps.onClick(...args);
        await children.props.onClick(...args);
      };
    }

    if (children.props.onChange && otherProps.onChange) {
      othterEvent.onChange = async (...args) => {
        await otherProps.onChange(...args);
        await children.props.onChange(...args);
      };
    }

    return React.cloneElement(children, {
      ...otherProps,
      ...children.props,
      ...othterEvent,
    });
  } else if (typeof children === "function") {
    return children(otherProps);
  } else {
    return children;
  }
};

const symbolReactElement = Symbol.for("react.element");
export const isReactElement = (input: any): input is React.ReactElement =>
  input?.$$typeof === symbolReactElement;
