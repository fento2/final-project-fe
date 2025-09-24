// Helper function to format Indonesian Rupiah
export const formatIDR = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

// Helper function to format compact IDR (for shorter display)
export const formatCompactIDR = (amount: number): string => {
    if (amount === 0) {
        return "Rp 0";
    } else if (amount >= 1000000000) {
        return `Rp ${(amount / 1000000000).toFixed(1)}M`;
    } else if (amount >= 1000000) {
        const jutaValue = amount / 1000000;
        return `Rp ${jutaValue % 1 === 0 ? jutaValue.toFixed(0) : jutaValue.toFixed(1)}Jt`;
    } else if (amount >= 1000) {
        return `Rp ${(amount / 1000).toFixed(0)}K`;
    }
    return formatIDR(amount);
};

// Indonesian salary ranges (in IDR)
export const IDR_SALARY_RANGES = {
    min: 0, // Rp 0
    max: 200000000, // 200 juta
    step: 1000000 // 1 juta
};