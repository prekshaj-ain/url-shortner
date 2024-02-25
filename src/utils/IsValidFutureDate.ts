export default function isValidFutureDate(dateString: string): boolean {
  const currDate = new Date();
  const date = new Date(dateString);
  return currDate < date;
}
