import { Star } from "lucide-react";

export function StarRating({ value, size = 16 }: { value: number; size?: number }) {
    const stars = Array.from({ length: 5 }, (_, i) => i + 1);
    return (
        <div className="flex items-center gap-1">
            {stars.map((s) => (
                <Star
                    key={s}
                    size={size}
                    className={s <= Math.round(value) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                />
            ))}
        </div>
    );
}