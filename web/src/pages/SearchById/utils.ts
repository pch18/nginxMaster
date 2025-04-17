export const checkTrace = (t: string) => {
  if (t.length !== 16) {
    return false;
  }
  return true;
};
