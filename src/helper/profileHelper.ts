export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const currentYear = new Date().getFullYear();
export const years = Array.from({ length: 61 }, (_, i) => currentYear - 50 + i);

/**
 * Convert month name + year to Date object
 * @param month Month name, e.g. "January"
 * @param year Full year, e.g. 2025
 * @returns Date object representing the first day of that month
 */

export const convertMonthYearToDate = (
  month: string,
  year: number
): Date | null => {
  const monthIndex = months.findIndex(
    (m) => m.toLowerCase() === month.toLowerCase()
  );
  if (monthIndex === -1) return null; // jika nama bulan salah
  return new Date(year, monthIndex, 1); // tanggal 1 di bulan itu
};
