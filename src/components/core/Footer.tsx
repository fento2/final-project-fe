import Image from "next/image";
import Link from "next/link";
import { Twitter, Instagram, Facebook, Linkedin, Globe } from "lucide-react";

export default function Footer() {
	return (
		<footer className="bg-gray-50 border-t border-gray-200">
			<div className="max-w-7xl mx-auto px-6 py-16">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-10">
					{/* Left: newsletter and logo */}
					<div>
						<h3 className="text-4xl font-extrabold text-gray-900">Stay Updated</h3>
						<p className="mt-4 text-gray-500 max-w-lg">
							Stay up-to-date with the latest job listings and career tips from our newsletter.
						</p>

						<form className="mt-8 max-w-md">
							<div className="relative rounded-2xl border-2 border-indigo-300 overflow-hidden">
								<input
									placeholder="Enter Email Address ..."
									className="w-full px-6 py-4 text-gray-600 placeholder-gray-400 bg-white outline-none"
									type="email"
									aria-label="email"
								/>

								<button
									className="absolute right-1 top-1/2 -translate-y-1/2 bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-lg mr-1"
									type="button"
								>
									Subscribe
								</button>
							</div>
						</form>

						<div className="mt-10">
							<div className="flex items-center gap-4">
								<Image src="/images/logo.png" alt="Job Linkup" width={120} height={40} />
							</div>

											<div className="mt-6 flex gap-3">
												<a className="w-8 h-8 rounded bg-black text-white flex items-center justify-center" href="#" aria-label="twitter">
													<Twitter size={16} />
												</a>
												<a className="w-8 h-8 rounded bg-black text-white flex items-center justify-center" href="#" aria-label="instagram">
													<Instagram size={16} />
												</a>
												<a className="w-8 h-8 rounded bg-black text-white flex items-center justify-center" href="#" aria-label="facebook">
													<Facebook size={16} />
												</a>
												<a className="w-8 h-8 rounded bg-black text-white flex items-center justify-center" href="#" aria-label="linkedin">
													<Linkedin size={16} />
												</a>
																<a className="w-8 h-8 rounded bg-black text-white flex items-center justify-center" href="#" aria-label="website">
																	<Globe size={16} />
																</a>
											</div>
						</div>
					</div>

					{/* Right: multi columns */}
					<div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
						<div>
							<h4 className="text-xl font-bold text-gray-900">Jobs</h4>
							<ul className="mt-4 text-gray-500 space-y-2">
								<li>
									<Link href="/jobs/browse" className="hover:text-indigo-600">Browse Jobs</Link>
								</li>
								<li>
									<Link href="/jobs/companies" className="hover:text-indigo-600">Top Companies</Link>
								</li>
								<li>
									<Link href="/jobs" className="hover:text-indigo-600">Featured Jobs</Link>
								</li>
								<li>
									<Link href={{ pathname: "/jobs/browse", query: { type: "Remote" } }} className="hover:text-indigo-600">Remote Jobs</Link>
								</li>
								<li>
									<Link href={{ pathname: "/jobs/browse", query: { categories: "Information Technology" } }} className="hover:text-indigo-600">Tech Jobs</Link>
								</li>
							</ul>
						</div>

						<div>
							<h4 className="text-xl font-bold text-gray-900">About</h4>
							<ul className="mt-4 text-gray-500 space-y-2">
								<li>
									<Link href="/about" className="hover:text-indigo-600">About Us</Link>
								</li>
								<li>
									<Link href="/services" className="hover:text-indigo-600">Services</Link>
								</li>
								<li>
									<Link href="/blog" className="hover:text-indigo-600">Blog</Link>
								</li>
								<li>
									<Link href="/contact" className="hover:text-indigo-600">Contact</Link>
								</li>
							</ul>
						</div>

						<div>
							<h4 className="text-xl font-bold text-gray-900">Services</h4>
							<ul className="mt-4 text-gray-500 space-y-2">
								<li>
									<Link href="/services" className="hover:text-indigo-600">For Job Seekers</Link>
								</li>
								<li>
									<Link href="/services" className="hover:text-indigo-600">For Employers</Link>
								</li>
								<li>
									<Link href="/contact" className="hover:text-indigo-600">Support</Link>
								</li>
							</ul>
						</div>

						<div>
							<h4 className="text-xl font-bold text-gray-900">Blog</h4>
							<ul className="mt-4 text-gray-500 space-y-2">
								<li>
									<Link href="/blog" className="hover:text-indigo-600">All Posts</Link>
								</li>
								<li>
									<Link href="/blog" className="hover:text-indigo-600">Hiring Tips</Link>
								</li>
								<li>
									<Link href="/blog" className="hover:text-indigo-600">Industry News</Link>
								</li>
							</ul>
						</div>

						<div>
							<h4 className="text-xl font-bold text-gray-900">Contact</h4>
							<ul className="mt-4 text-gray-500 space-y-2">
								<li>
									<Link href="/contact" className="hover:text-indigo-600">Contact Page</Link>
								</li>
								<li>
									<Link href="/contact" className="hover:text-indigo-600">Email Us</Link>
								</li>
								<li>
									<a href="#" className="hover:text-indigo-600">Social Media</a>
								</li>
							</ul>
						</div>
					</div>
				</div>

				<div className="mt-10 border-t pt-6 text-sm text-gray-500 flex items-center justify-between">
					<div>Copyright © 2025 by Horizon Jobs. All rights reserved.</div>
					<div>Privacy Policy. Terms & Condition.</div>
				</div>
			</div>
		</footer>
	);
}

