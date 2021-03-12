export const secondsToHms = (d) => {
  d = Number(d);
  const h = Math.floor(d / 3600);
  const m = Math.floor(d % 3600 / 60);
  const s = Math.floor(d % 3600 % 60);

  const hDisplay = ` ${h}h`;
  const mDisplay = ` ${m}m`;
  const sDisplay = ` ${s}s`;
  return hDisplay + mDisplay + sDisplay; 
}
