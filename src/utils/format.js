export function fmtMoney(n) {
  const num = Number(n ?? 0);
  return num.toLocaleString(undefined, { style: "currency", currency: "USD" });
}
