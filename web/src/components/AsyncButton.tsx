import { Button, type ButtonProps } from "@arco-design/web-react";
import { forwardRef, useState, type FC } from "react";

export const AsyncButton = forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, "onClick"> & { onClick: (e: Event) => Promise<void> }
>(({ onClick, ...otherProps }, ref) => {
  const [loading, setLoading] = useState(false);
  const handleClick = async (e: Event) => {
    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/await-thenable
      await onClick?.(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button ref={ref} onClick={handleClick} loading={loading} {...otherProps} />
  );
});
