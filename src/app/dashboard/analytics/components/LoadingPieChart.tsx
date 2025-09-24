const LoadingPieChart = () => {
    return (
        <>
            <div className="grid lg:grid-cols-4 md:grid-cols-7 grid-cols-3 items-center">
                {/* Legend skeleton */}
                <ul className="flex flex-col gap-2 col-span-1">
                    {[...Array(6)].map((_, i) => (
                        <li key={i} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-gray-300 animate-pulse" />
                            <div className="h-3 w-20 bg-gray-300 rounded animate-pulse" />
                        </li>
                    ))}
                </ul>

                {/* Chart skeleton */}
                <div className="lg:col-span-3 md:col-span-6 col-span-2 flex items-center justify-center">
                    <div className="relative w-60 h-60 flex items-center justify-center animate-pulse">
                        {/* Lingkaran luar pakai conic-gradient biar mirip pie */}
                        <div
                            className="absolute w-full h-full rounded-full animate-spin-slow"
                            style={{
                                background: "conic-gradient(#d1d5db 0% 25%, #e5e7eb 25% 50%, #d1d5db 50% 75%, #e5e7eb 75% 100%)",
                            }}
                        />
                        {/* Lingkaran dalam (lubang tengah) */}
                        <div className="absolute w-20 h-20 rounded-full bg-white" />
                    </div>
                </div>
            </div>
        </>
    )
}
export default LoadingPieChart