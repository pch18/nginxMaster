import { type SwitchProps, Switch } from "@arco-design/web-react";
import { useState, type FC } from "react";

export const AsyncSwitch: FC<
  Omit<SwitchProps, "onChange"> & {
    onChange: (v: boolean, e: Event) => Promise<void>;
  }
> = ({ onChange, ...otherProps }) => {
  const [loading, setLoading] = useState(false);
  const handleChange = async (v: boolean, e: Event) => {
    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/await-thenable
      await onChange?.(v, e);
    } finally {
      setLoading(false);
    }
  };

  return <Switch onChange={handleChange} loading={loading} {...otherProps} />;
};
