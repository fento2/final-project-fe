import { motion } from "framer-motion";
import { Button } from "../../../../components/ui/button";

export function CTASection() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-20"
        >
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl py-16 px-8 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10">
                    <h2 className="text-4xl font-extrabold mb-6">
                        Ready to Join Amazing Companies?
                    </h2>
                    <p className="mb-8 text-xl text-blue-100 max-w-2xl mx-auto">
                        Create your profile today and get discovered by top companies. Your dream job is just one click away!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button 
                            className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-bold text-lg"
                            onClick={() => window.open('/auth/signup', '_blank')}
                        >
                            Create Profile
                        </Button>
                        <Button 
                            variant="outline" 
                            className="border-white text-indigo-500 hover:bg-white hover:text-indigo-600 px-8 py-4 rounded-xl font-bold text-lg"
                            onClick={() => window.open('/jobs', '_blank')}
                        >
                            Browse Jobs
                        </Button>
                    </div>
                </div>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full"></div>
            </div>
        </motion.div>
    );
}
