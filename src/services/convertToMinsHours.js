const convertMinutes = (minutes) => {
  if (minutes === null || minutes === 0 || isNaN(minutes)) return "----";
  let h = Math.trunc(minutes / 60);
  let m = minutes % 60;

  let hDisplay = h > 0 ? h + (h === 1 ? " Hour " : " Hours ") : "";
  let mDisplay = m > 0 ? m + (m === 1 ? " Minute " : " Minutes ") : "";

  return hDisplay + mDisplay;
}

export default convertMinutes;