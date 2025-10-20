"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { PlusIcon, XIcon } from "lucide-react";

const FAQSection = () => {
    const [openItems, setOpenItems] = useState<number[]>([0]); // First item open by default
    const [message, setMessage] = useState("");

    const toggleItem = (index: number) => {
        setOpenItems(prev =>
            prev.includes(index)
                ? prev.filter(item => item !== index)
                : [...prev, index]
        );
    };

    const faqItems = [
        {
            question: "How do I search for jobs on Horizon Jobs?",
            answer: "To search for jobs on Horizon Jobs, simply navigate to the homepage and enter your search criteria in the search bar at the top of the page. You can enter keywords related to the type of job you're looking for, as well as location and other filters such as job type or salary range. After that, click the Search button to begin your job hunting journey."
        },
        {
            question: "How do I apply for a job on Horizon Jobs?",
            answer: "To apply for a job on Horizon Jobs, first create an account and complete your profile. Then browse job listings and click 'Apply' on positions that interest you. Follow the application process specific to each employer."
        },
        {
            question: "Can I save job listings to apply later?",
            answer: "Yes, you can save job listings to your favorites by clicking the bookmark icon on any job listing. Access your saved jobs anytime from your profile dashboard."
        },
        {
            question: "How do I create a Horizon Jobs account?",
            answer: "Creating a Horizon Jobs account is easy! Click the 'Sign Up' button at the top of the page, fill in your basic information, verify your email address, and complete your profile."
        },
        {
            question: "What type of jobs are listed on Horizon Jobs?",
            answer: "Horizon Jobs features a wide variety of job opportunities across multiple industries including technology, healthcare, finance, marketing, education, and many more. From entry-level to executive positions."
        },
        {
            question: "Can I apply for jobs outside of my location?",
            answer: "Absolutely! Horizon Jobs features both local and remote job opportunities. You can filter by location or search for remote positions that allow you to work from anywhere."
        },
        {
            question: "How do I know if a job listing is still open?",
            answer: "Job listings on Horizon Jobs are regularly updated. Active listings will show an 'Apply Now' button. If a position has been filled, it will be marked as closed or removed from active listings."
        },
        {
            question: "Are all job listings on Horizon Jobs verified?",
            answer: "Yes, we take verification seriously. All companies and job listings go through our verification process to ensure legitimacy and protect our users from fraudulent postings."
        }
    ]; const handleSendMessage = () => {
        if (message.trim()) {
            // Handle message sending logic here
            setMessage("");
        }
    };

    return (
        <section className="py-20 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Left Side - FAQ Title & Contact Form at Bottom */}
                    <div className="relative flex flex-col min-h-[600px]">
                        {/* Large Question Mark Background - Right side of left column */}
                        <div className="absolute -right-1 -top-10 opacity-10 pointer-events-none">
                            <div className="text-[400px] font-bold text-indigo-300 leading-none select-none">
                                ?
                            </div>
                        </div>

                        {/* FAQ Title and Description */}
                        <div className="relative z-10 mb-8">
                            <h2 className="text-5xl font-bold text-gray-900 mb-4">
                                FAQ
                            </h2>
                            <p className="text-gray-600 text-lg leading-relaxed max-w-md">
                                Frequently asked questions about our services.
                                Please send us your questions if you have
                                any inquiries regarding our <span className="text-indigo-600">services</span>.
                            </p>
                        </div>

                        {/* Empty space to push contact form to bottom */}
                        <div className="flex-1"></div>

                        {/* Contact Form at Bottom */}
                        <div className="relative z-10">
                            <div className="bg-gray-50 rounded-3xl p-10 shadow-lg">
                                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                                    Got any questions for us?
                                </h3>

                                <div className="space-y-6">
                                    <Input
                                        type="text"
                                        placeholder="Enter your questions ..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className="w-full p-6 border border-gray-200 rounded-xl text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                    />

                                    <Button
                                        onClick={handleSendMessage}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-l font-semibold text-lg transition-colors w-full sm:w-auto"
                                    >
                                        Send Us A Message
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - FAQ Items */}
                    <div className="lg:pl-8">
                        <div className="space-y-1">
                            {faqItems.map((item, index) => (
                                <div key={index} className="border-b border-gray-200 last:border-b-0">
                                    <button
                                        onClick={() => toggleItem(index)}
                                        className="w-full py-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors group"
                                    >
                                        <span className="font-semibold text-gray-900 pr-4 text-lg">
                                            {item.question}
                                        </span>
                                        <div className="flex-shrink-0">
                                            {openItems.includes(index) ? (
                                                <XIcon className="w-6 h-6 text-indigo-600" />
                                            ) : (
                                                <PlusIcon className="w-6 h-6 text-indigo-600" />
                                            )}
                                        </div>
                                    </button>

                                    {openItems.includes(index) && (
                                        <div className="pb-6 pr-12">
                                            <p className="text-gray-600 leading-relaxed">
                                                {item.answer}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
