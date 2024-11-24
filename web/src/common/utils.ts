const sizes = ["b", "B", "K", "M", "G", "T"];
export const formatBytes = (bytes: number) => {
  if (bytes === 0) {
    return "0B";
  }
  const logK = Math.log(1024);
  const i = Math.min(Math.floor(Math.log(bytes) / logK), 4);
  const formattedBytes = (bytes / Math.pow(1024, i)).toFixed(1);
  return `${formattedBytes}${sizes[i + 1] || ""}`;
};
