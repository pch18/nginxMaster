import { Tooltip } from "@arco-design/web-react";
import React, { useRef, type CSSProperties, useState } from "react";
import styled from "styled-components";

type OverflowTooltipProps = React.HTMLAttributes<HTMLDivElement> & {
  /** 附加在tooltip上的style */
  tooltipStyle?: CSSProperties;
  /** 最大行数,默认1行 */
  line?: number;
  tooltipContent?: React.ReactElement;
};

/**
 * 传入文本,超框的话,用tooltip展示,
 * */
export const OverflowTooltip: React.FC<OverflowTooltipProps> = (props) => {
  const {
    className,
    style,
    tooltipStyle = {},
    children,
    line = 1,
    tooltipContent,
    ...divProps
  } = props;
  const childRef = useRef<HTMLDivElement>(null);

  const [showTooltip, setShowTooltip] = useState(false);

  const updateShowTooltip = () => {
    setShowTooltip(
      childRef.current
        ? childRef.current.clientWidth < childRef.current.scrollWidth ||
            childRef.current.clientHeight < childRef.current.scrollHeight
        : false
    );
  };

  return (
    <WrapperTooltip
      style={{ whiteSpace: "pre-wrap", ...tooltipStyle }}
      triggerProps={{ autoFitPosition: true }}
      content={tooltipContent || children}
      popupVisible={showTooltip}
      color="#fff"
    >
      <WrapperMainDiv
        {...divProps}
        style={style}
        className={className}
        $line={line}
        ref={childRef}
        onMouseEnter={updateShowTooltip}
        onMouseLeave={() => {
          setShowTooltip(false);
        }}
      >
        {children}
      </WrapperMainDiv>
    </WrapperTooltip>
  );
};

const WrapperMainDiv = styled.div<{ $line: number }>`
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: ${(p) => p.$line};
  display: -webkit-box;
  -webkit-box-orient: vertical;
  word-break: break-all;
`;

const WrapperTooltip = styled(Tooltip)`
  .arco-tooltip-content-top,
  .arco-tooltip-content-inner {
    width: fit-content;
    word-break: break-all;
    color: var(--text-color-text-1);
  }
`;
