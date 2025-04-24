import { Button } from "@arco-design/web-react";
import clsx from "clsx";
import { useState, type FC } from "react";

const showCount = 3;
export const Stack: FC<{ list: string[]; className?: string }> = ({
  list,
  className,
}) => {
  const [showMore, setShowMore] = useState(false);
  return (
    <div
      className={clsx(
        className,
        "text-xs text-color-text-2 border rounded-lg overflow-hidden"
      )}
    >
      {(showMore ? list : list.slice(0, showCount)).map((li, ind) => (
        <div
          key={ind}
          className="break-all p-1 first:border-none border-t hover:bg-color-bg-4 hover:font-bold"
        >
          {li}
        </div>
      ))}
      {!showMore && list.length > showCount ? (
        <div className="break-all p-1 border-t">
          <Button
            type="text"
            size="mini"
            className="!block mx-auto"
            onClick={() => {
              setShowMore(true);
            }}
          >
            加载全部 {list.length}条
          </Button>
        </div>
      ) : null}
    </div>
  );
};
