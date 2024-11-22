import { Popover, Tooltip } from "@arco-design/web-react";
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
    tooltipContent,
    ...divProps
  } = props;
  const childRef = useRef<HTMLDivElement>(null);

  const [showTooltip, setShowTooltip] = useState(false);

  const updateShowTooltip = () => {
    setShowTooltip(
      childRef.current
        ? childRef.current.clientWidth < childRef.current.scrollWidth
        : false
    );
  };

  return (
    <WrapperTooltip
      style={{ whiteSpace: "pre-wrap", ...tooltipStyle }}
      triggerProps={{ autoFitPosition: true }}
      content={tooltipContent || children}
      popupVisible={showTooltip}
    >
      <WrapperMainDiv
        {...divProps}
        style={style}
        className={className}
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

const WrapperMainDiv = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  word-break: break-all;
`;

const WrapperTooltip = styled(Popover)`
  .arco-tooltip-content-top,
  .arco-tooltip-content-inner {
    width: fit-content;
    word-break: break-all;
  }
`;
