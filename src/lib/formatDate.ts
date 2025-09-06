export default function formatDateID(d: string) {
    return new Date(d).toLocaleString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
    // contoh: "05 September 2025 14.30"
}