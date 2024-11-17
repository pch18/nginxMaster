export const certTimeToStamp = (dateString: string) => {
  const year = Number(dateString.slice(0, 4)) || 0;
  const month = Number(dateString.slice(4, 6)) || 0;
  const day = Number(dateString.slice(6, 8)) || 0;
  const hour = Number(dateString.slice(8, 10)) || 0;
  const minute = Number(dateString.slice(10, 12)) || 0;
  const second = Number(dateString.slice(12, 14)) || 0;
  const date = new Date(year, month - 1, day, hour, minute, second);
  const stamp = date.getTime() - date.getTimezoneOffset() * 1000 * 60;
  return isNaN(stamp) || stamp < 0 ? 0 : stamp;
};
