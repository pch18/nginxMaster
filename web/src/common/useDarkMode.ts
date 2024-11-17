import { useLocalStorageState } from "ahooks";

export const useDarkMode = () => {
  const [isDark, setIsDark] = useLocalStorageState<boolean>(
    "page-use-dark-mode",
    { defaultValue: true }
  );
  return [isDark, setIsDark] as const;
};
