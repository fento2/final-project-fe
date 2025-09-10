import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react";

// Mock data - in a real app, this would come from a CMS or database
const blogPosts = {
    "10-tips-acing-job-interview": {
        id: 1,
        title: "10 Tips for Acing Your Next Job Interview",
        excerpt: "Master the art of job interviews with these proven strategies that will help you stand out from other candidates.",
        content: `
            <p>Job interviews can be nerve-wracking, but with the right preparation and mindset, you can turn them into opportunities to shine. Here are 10 proven tips that will help you ace your next job interview.</p>
            
            <h2>1. Research the Company Thoroughly</h2>
            <p>Before walking into any interview, spend time researching the company. Understand their mission, values, recent news, and the role you're applying for. This knowledge will help you tailor your responses and show genuine interest.</p>
            
            <h2>2. Prepare Your STAR Stories</h2>
            <p>Use the STAR method (Situation, Task, Action, Result) to structure your responses to behavioral questions. Prepare 3-5 compelling stories that demonstrate your skills and achievements.</p>
            
            <h2>3. Practice Common Interview Questions</h2>
            <p>While you can't predict every question, practicing common ones like "Tell me about yourself" and "Why do you want this job?" will help you respond confidently.</p>
            
            <h2>4. Prepare Thoughtful Questions</h2>
            <p>Always have questions ready to ask the interviewer. This shows your interest and helps you evaluate if the company is right for you.</p>
            
            <h2>5. Dress Appropriately</h2>
            <p>Research the company culture and dress slightly more formal than their everyday attire. When in doubt, it's better to be overdressed than underdressed.</p>
        `,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
        category: "Career Tips",
        date: "2024-09-08",
        readTime: "5 min read",
        author: {
            name: "Sarah Johnson",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b29c?w=100&h=100&fit=crop&crop=face",
            bio: "Career Coach & HR Professional with 10+ years of experience"
        }
    }
    // Add more blog posts here
};

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = blogPosts[slug as keyof typeof blogPosts];

    if (!post) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-6">
                    <Link 
                        href="/blog" 
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-6"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Blog
                    </Link>
                    
                    <div className="mb-4">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            {post.category}
                        </span>
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        {post.title}
                    </h1>
                    
                    <div className="flex items-center gap-6 text-gray-600">
                        <div className="flex items-center gap-2">
                            <Image
                                src={post.author.avatar}
                                alt={post.author.name}
                                width={40}
                                height={40}
                                className="rounded-full"
                            />
                            <span className="font-medium">{post.author.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(post.date).toLocaleDateString('en-US', { 
                                month: 'long', 
                                day: 'numeric', 
                                year: 'numeric' 
                            })}
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {post.readTime}
                        </div>
                        <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700">
                            <Share2 className="w-4 h-4" />
                            Share
                        </button>
                    </div>
                </div>
            </div>

            {/* Featured Image */}
            <div className="relative h-96 w-full">
                <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                />
            </div>

            {/* Article Content */}
            <article className="max-w-4xl mx-auto px-6 py-12">
                <div className="prose prose-lg max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </div>

                {/* Author Bio */}
                <div className="mt-12 p-6 bg-gray-50 rounded-2xl">
                    <div className="flex items-start gap-4">
                        <Image
                            src={post.author.avatar}
                            alt={post.author.name}
                            width={80}
                            height={80}
                            className="rounded-full"
                        />
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {post.author.name}
                            </h3>
                            <p className="text-gray-600">
                                {post.author.bio}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Related Articles */}
                <div className="mt-12">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                        Related Articles
                    </h3>
                    <div className="text-center text-gray-500">
                        <p>More related articles coming soon...</p>
                    </div>
                </div>
            </article>
        </div>
    );
}
