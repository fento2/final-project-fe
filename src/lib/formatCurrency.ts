export interface FormatCurrencyOptions {
    locale?: string;
    currency?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    useCompact?: boolean;
}

export default function formatCurrency(
    value: number | string | null | undefined,
    opts: FormatCurrencyOptions = {}
): string {
    if (value === null || value === undefined || value === "") return "-";

    let num: number;
    if (typeof value === "string") {
        const cleaned = value
            .replace(/\s/g, "")
            .replace(/IDR|Rp|USD|€|£/gi, "")
            .replace(/\./g, "")
            .replace(/,/g, ".");
        num = Number(cleaned);
    } else {
        num = Number(value);
    }

    if (!isFinite(num)) return "-";

    const locale = opts.locale ?? "id-ID";
    const currency = opts.currency ?? "IDR";
    const maxFrac = opts.maximumFractionDigits ?? (currency === "IDR" ? 0 : 2);
    const minFrac = opts.minimumFractionDigits ?? 0;

    try {
        return new Intl.NumberFormat(locale, {
            style: "currency",
            currency,
            minimumFractionDigits: minFrac,
            maximumFractionDigits: maxFrac,
            notation: opts.useCompact ? "compact" : "standard",
        }).format(num);
    } catch {
        return num.toLocaleString(locale, { maximumFractionDigits: maxFrac });
    }
}