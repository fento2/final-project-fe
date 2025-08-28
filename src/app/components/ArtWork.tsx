"use client";

import Image from "next/image";

export default function Artwork() {
    return (
        <div className="w-full lg:flex-1 flex items-center justify-center p-6 mt-6 lg:mt-0 order-first lg:order-last">
            <div className="w-full rounded-2xl overflow-hidden shadow-lg">
                <Image
                    src="https://images.unsplash.com/photo-1575257922566-5d0a4a2da788?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.1.0"
                    alt="Artwork"
                    width={1174}
                    height={785}
                    className="object-cover w-full h-64 lg:h-[720px]"
                />
            </div>
        </div>
    );
}