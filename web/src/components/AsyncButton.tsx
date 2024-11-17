import { Button, type ButtonProps } from "@arco-design/web-react";
import { useState, type FC } from "react";

export const AsyncButton: FC<
  Omit<ButtonProps, "onClick"> & { onClick: (e: Event) => Promise<void> }
> = ({ onClick, ...otherProps }) => {
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

  return <Button onClick={handleClick} loading={loading} {...otherProps} />;
};
