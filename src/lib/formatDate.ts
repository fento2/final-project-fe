const getUserTimeZone = () => {
    try {
        return Intl?.DateTimeFormat?.().resolvedOptions().timeZone;
    } catch {
        return undefined;
    }
};

export default function formatDateID(d: string) {
    const tz = getUserTimeZone();
    return new Date(d).toLocaleString("id-ID", {
        timeZone: tz,
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
    // contoh: "05 September 2025 14.30"
}

export function formatDateIDDateOnly(d: string | Date): string {
    const date = new Date(d);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

const monthMap: Record<string, number> = {
    January: 0,
    February: 1,
    March: 2,
    April: 3,
    May: 4,
    June: 5,
    July: 6,
    August: 7,
    September: 8,
    October: 9,
    November: 10,
    December: 11,
};

export function toDateString(month: string, year: string, isEnd = false): string | null {
    if (!month || !year) return null;
    const monthIndex = monthMap[month];
    if (monthIndex === undefined) return null;

    // kalau end date → ambil hari terakhir di bulan tsb
    const day = isEnd ? new Date(Number(year), monthIndex + 1, 0).getDate() : 1;

    const date = new Date(Number(year), monthIndex, day);

    // format YYYY-MM-DD HH:mm:ss
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const mi = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}

export function toDateStartTimestamp(input: string | Date): string {
    if (!input) return "";
    // jika sudah berbentuk "YYYY-MM-DD" langsung tambahkan waktu
    if (typeof input === "string" && /^\d{4}-\d{2}-\d{2}$/.test(input)) {
        return `${input} 00:00:00`;
    }

    const d = typeof input === "string" ? new Date(input) : input;
    if (Number.isNaN(d.getTime())) return "";

    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd} 00:00:00`;
}