export const getLocalTimezone = () => {
  const timezoneWithSaving = new Date().getTimezoneOffset() / 60;
  let absTimezone = Math.abs(timezoneWithSaving).toString();
  if (absTimezone.length === 1) {
    absTimezone = "0" + absTimezone;
  }
  absTimezone = timezoneWithSaving < 0 ? "+" + absTimezone : "-" + absTimezone;
  return absTimezone + ":00";
};
