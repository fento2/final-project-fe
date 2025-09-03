import { motion } from "framer-motion";

interface HeaderSectionProps {
    title: string;
    subtitle: string;
    breadcrumb?: string[];
}

export function HeaderSection({ title, subtitle, breadcrumb }: HeaderSectionProps) {
    return (
        <div className="relative w-full h-[180px] xs:h-[200px] sm:h-[240px] md:h-[280px] lg:h-[320px] xl:h-[360px] overflow-hidden flex items-end">
            <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=1080&fit=crop"
                alt="Header Background"
                className="absolute inset-0 w-full h-full object-cover z-0"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-indigo-900/60 z-10" />
            <div className="relative z-20 px-4 py-6 xs:px-5 xs:py-7 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-12 lg:py-16 xl:px-16 xl:py-20 max-w-7xl w-full mx-auto">
                {breadcrumb && (
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-3 sm:mb-4 text-blue-200 font-medium text-xs xs:text-sm md:text-base"
                    >
                        {breadcrumb.map((item, index) => (
                            <span key={index}>
                                {index > 0 && <span className="mx-1 sm:mx-2">/</span>}
                                <span className={index === breadcrumb.length - 1 ? "text-white font-bold" : ""}>
                                    {item}
                                </span>
                            </span>
                        ))}
                    </motion.div>
                )}
                <motion.h1 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight"
                >
                    {title}
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-blue-100 text-sm xs:text-base sm:text-lg md:text-xl mt-2 sm:mt-3 md:mt-4 max-w-xl sm:max-w-2xl lg:max-w-3xl"
                >
                    {subtitle}
                </motion.p>
            </div>
        </div>
    );
}
