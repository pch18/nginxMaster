import { Popover } from "@arco-design/web-react";
import { isEqual } from "lodash-es";
import React, { useRef, useState, memo } from "react";
import styled from "styled-components";

/**
 * 传入文本,超框的话,用tooltip展示,
 * */
export const OverflowTooltip: React.FC<{
  className?: string;
  children?: React.ReactNode;
}> = memo(
  ({ className, children }) => {
    const childRef = useRef<HTMLDivElement>(null);

    const [showTooltip, setShowTooltip] = useState(false);
    const timerRef = useRef<number>();
    const updateShowTooltip = () => {
      const show = childRef.current
        ? childRef.current.clientWidth < childRef.current.scrollWidth
        : false;
      if (show) {
        timerRef.current = setTimeout(() => {
          const show = childRef.current
            ? childRef.current.clientWidth < childRef.current.scrollWidth
            : false;
          setShowTooltip(show);
        }, 100);
      }
    };

    return (
      <WrapperTooltip
        className="whitespace-pre-wrap"
        triggerProps={{ autoFitPosition: true }}
        content={children}
        popupVisible={showTooltip}
        // getPopupContainer={() => document.body}
      >
        <WrapperMainDiv
          className={className}
          ref={childRef}
          onMouseEnter={updateShowTooltip}
          onMouseLeave={() => {
            clearTimeout(timerRef.current);
            setShowTooltip(false);
          }}
        >
          {children}
        </WrapperMainDiv>
      </WrapperTooltip>
    );
  },
  (p, n) => {
    return isEqual(p.children, n.children) && p.className === n.className;
  }
);

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
