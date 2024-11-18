import { createGlobalStore } from "hox";
import { useEffect, useState } from "react";

export const [useDarkMode] = createGlobalStore(() => {
  const [isDark, setIsDark] = useState(() => {
    const m = window.matchMedia("(prefers-color-scheme: dark)");
    const sysDarkRaw = localStorage.getItem("_useDarkMode_sysDark");
    const sysDark = sysDarkRaw === null ? null : sysDarkRaw === "1";
    localStorage.setItem("_useDarkMode_sysDark", m.matches ? "1" : "0");

    const usrDarkRaw = localStorage.getItem("_useDarkMode_usrDark");
    const usrDark = usrDarkRaw === null ? null : usrDarkRaw === "1";

    if (sysDark !== null && m.matches !== sysDark) {
      return m.matches;
    } else if (usrDark !== null) {
      return usrDark;
    } else {
      return m.matches;
    }
  });

  useEffect(() => {
    localStorage.setItem("_useDarkMode_usrDark", isDark ? "1" : "0");
  }, [isDark]);

  useEffect(() => {
    const m = window.matchMedia("(prefers-color-scheme: dark)");
    const handle = (e: MediaQueryListEvent) => {
      localStorage.setItem("_useDarkMode_sysDark", e.matches ? "1" : "0");
      setIsDark(e.matches);
    };
    m.addEventListener("change", handle);
    return () => {
      m.removeEventListener("change", handle);
    };
  }, []);

  return [isDark, setIsDark] as const;
});
