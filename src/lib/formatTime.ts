export const formatTime = (s: number) => {
    const hh = Math.floor(s / 3600)
        .toString()
        .padStart(2, "0");
    const mm = Math.floor((s % 3600) / 60)
        .toString()
        .padStart(2, "0");
    const ss = Math.floor(s % 60)
        .toString()
        .padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
};