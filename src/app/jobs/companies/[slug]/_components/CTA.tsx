import Link from "next/link";

export default function CTA() {
    return (
        <section className="max-w-7xl mx-auto px-6 pb-14">
            <div className="bg-indigo-950 text-indigo-50 rounded-3xl p-8 md:p-12">
                <h3 className="text-2xl md:text-3xl font-bold mb-3">
                    Join Horizon Jobs today and take the first step towards finding your dream job!
                </h3>
                <p className="text-indigo-200 mb-6 max-w-3xl">
                    With our user-friendly platform and up-to-date job listings, you\'ll be on your way to a fulfilling career in no time. Sign up now and see what opportunities await!
                </p>
                <Link
                    href="/signup"
                    className="inline-flex bg-indigo-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-indigo-700"
                >
                    Join Now
                </Link>
            </div>
        </section>
    )
}