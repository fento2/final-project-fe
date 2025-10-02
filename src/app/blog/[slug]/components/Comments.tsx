"use client";
import { useState } from "react";
import Image from "next/image";

interface Comment {
    id: number;
    name: string;
    email: string;
    comment: string;
    date: Date;
    avatar?: string;
}

interface CommentsProps {
    postId: string;
}

export default function Comments({ postId }: CommentsProps) {
    const [comments, setComments] = useState<Comment[]>([
        {
            id: 1,
            name: "Sarah Watson",
            email: "sarah@example.com",
            comment: "Thanks for sharing these insights, Java. As someone who's been working remotely for several years now, I think engaging in new innovative companies embracing this trend.",
            date: new Date("2023-02-15"),
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b000?w=50&h=50&fit=crop&crop=face"
        },
        {
            id: 2,
            name: "John Langston",
            email: "john@example.com",
            comment: "I found this article to be very informative and well-written. As someone who works in the technology industry, I can attest to the growing demand for workers with digital skills. It's important for employees to recognize the value of investing in their professional development, both for the sake of the individual career and for the success of the company as a whole.",
            date: new Date("2023-02-16"),
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face"
        },
        {
            id: 3,
            name: "Maria Stephens",
            email: "maria@example.com",
            comment: "I appreciate the focus on employee wellness and mental health in this article. As someone who has struggled with burnout in the past, I think it's essential for employers to prioritize these issues. That being said, I also agree with the point about work-life balance and the pressure to always be available. It's important for companies to find a balance that works for both employees and the business.",
            date: new Date("2023-02-17"),
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face"
        }
    ]);

    const [newComment, setNewComment] = useState({
        name: "",
        email: "",
        comment: ""
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!newComment.name || !newComment.email || !newComment.comment) {
            return;
        }

        const comment: Comment = {
            id: comments.length + 1,
            name: newComment.name,
            email: newComment.email,
            comment: newComment.comment,
            date: new Date(),
            avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face`
        };

        setComments([...comments, comment]);
        setNewComment({ name: "", email: "", comment: "" });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    return (
        <div className="mt-12">
            {/* Comments Section */}
            <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    Comments ({comments.length})
                </h3>
                
                <div className="space-y-6">
                    {comments.map((comment) => (
                        <div key={comment.id} className="flex gap-4">
                            <div className="flex-shrink-0">
                                {comment.avatar ? (
                                    <Image
                                        src={comment.avatar}
                                        alt={comment.name}
                                        width={50}
                                        height={50}
                                        className="rounded-full"
                                    />
                                ) : (
                                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                                        {getInitials(comment.name)}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-medium text-gray-900">{comment.name}</h4>
                                    <span className="text-sm text-gray-500">•</span>
                                    <span className="text-sm text-gray-500">{formatDate(comment.date)}</span>
                                </div>
                                <p className="text-gray-700 leading-relaxed">{comment.comment}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Comment Form */}
            <div className="border-t pt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Add New Comment</h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Your Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={newComment.name}
                                onChange={(e) => setNewComment({...newComment, name: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                placeholder="Enter your name..."
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Your Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={newComment.email}
                                onChange={(e) => setNewComment({...newComment, email: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                placeholder="Enter your email address..."
                                required
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                            Your Comment
                        </label>
                        <textarea
                            id="comment"
                            rows={4}
                            value={newComment.comment}
                            onChange={(e) => setNewComment({...newComment, comment: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                            placeholder="Enter your comment..."
                            required
                        />
                    </div>
                    
                    <div>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
