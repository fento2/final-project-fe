import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Banknote, CircleCheck, Bookmark, BookmarkCheck, Share2, Copy, MessageCircle } from "lucide-react";
import { toTitleCase } from "@/helper/toTitleCase";

interface HeroHeaderProps {
  jobTitle: string;
  companyName: string;
  companyLogo: string;
  location: string;
  salaryStr: string;
  period: string;
  category?: string;
  jobType?: string;
  canApplyJobs?: boolean;
  canSaveJobs?: boolean;
  isSaved?: boolean;
  isSaveLoading?: boolean;
  toggleSave?: () => void;
  shareBtnRef?: React.RefObject<HTMLButtonElement>;
  showShareMenu?: boolean;
  setShowShareMenu?: (v: boolean) => void;
  handleCopyLink?: () => void;
  handleShareWhatsApp?: () => void;
  handleShare?: () => void;
  slug?: string;
  children?: React.ReactNode;
}

const HeroHeader: React.FC<HeroHeaderProps> = ({ jobTitle, companyName, companyLogo, location, salaryStr, period, category, jobType, canApplyJobs, canSaveJobs, isSaved, isSaveLoading, toggleSave, shareBtnRef, showShareMenu, setShowShareMenu, handleCopyLink, handleShareWhatsApp, handleShare, slug, children }) => (
  <div className="relative bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/images/bg_hero.jpg')` }}>
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* Breadcrumb */}
      {children}
      {/* Job Header */}
      <div className="text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{jobTitle}</h1>
        <div className="flex items-center gap-4 mb-6">
          {companyLogo ? (
            <Image src={companyLogo} alt={companyName} width={64} height={64} className="w-16 h-16 rounded-lg bg-white/10 object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-white/10 flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {companyName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold">{companyName}</h2>
              <CircleCheck fill="blue" color="white" className="w-5 h-5" />
            </div>
            <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Banknote className="w-4 h-4" />
                <span>{salaryStr} per {period}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-8">
          {category && <span className="px-3 py-1 text-sm font-medium bg-blue-600 text-white rounded-md">{toTitleCase(category)}</span>}
          {jobType && <span className="px-3 py-1 text-sm font-medium bg-purple-600 text-white rounded-md">{toTitleCase(jobType)}</span>}
          <span className="px-3 py-1 text-sm font-medium bg-red-600 text-white rounded-md">Urgently Needed</span>
        </div>
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-2">
          {canApplyJobs ? (
            <Link
              href={`/jobs/${slug}/apply`}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors inline-block"
            >
              Apply Now
            </Link>
          ) : (
            <div className="bg-gray-100 text-gray-500 font-semibold px-6 py-3 rounded-lg flex items-center">
              <span>Application not available</span>
            </div>
          )}
          {canSaveJobs && (
            <button
              onClick={toggleSave}
              disabled={isSaveLoading}
              className={`px-6 py-3 rounded-lg transition-colors flex items-center gap-2 font-semibold ${isSaved
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-600'
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/30'
                }`}
              title={isSaved ? 'Remove from saved jobs' : 'Save this job'}
            >
              {isSaved ? (
                <BookmarkCheck className="w-5 h-5" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
              {isSaved ? 'Saved' : 'Save Job'}
            </button>
          )}
          <div className="relative inline-block">
            <button
              ref={shareBtnRef}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
              onClick={() => setShowShareMenu && setShowShareMenu(!showShareMenu)}
              title="Share this job"
            >
              <Share2 className="w-5 h-5" />
            </button>
            {showShareMenu && setShowShareMenu && handleCopyLink && handleShareWhatsApp && handleShare && (
              <>
                {/* Mobile Modal */}
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 md:hidden" onClick={() => setShowShareMenu(false)}>
                  <div className="bg-gray-800 border border-gray-200 rounded-lg shadow-lg w-72 mx-4 p-4 relative" onClick={e => e.stopPropagation()}>
                    <button
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-700"
                      onClick={handleCopyLink}
                    >
                      <Copy className="w-4 h-4 text-gray-500" />
                      Salin Link
                    </button>
                    <button
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-700"
                      onClick={handleShareWhatsApp}
                    >
                      <MessageCircle className="w-4 h-4 text-green-500" />
                      Share on WhatsApp
                    </button>
                    <button
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-700"
                      onClick={handleShare}
                    >
                      <Share2 className="w-4 h-4 text-blue-500" />
                      Share (Web Share)
                    </button>
                    <button
                      className="absolute top-2 right-2 text-gray-400 hover:text-white"
                      onClick={() => setShowShareMenu(false)}
                      aria-label="Close"
                    >
                      ×
                    </button>
                  </div>
                </div>
                {/* Desktop Dropdown */}
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-200 rounded-lg shadow-lg z-50 hidden md:block">
                  <button
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-700"
                    onClick={handleCopyLink}
                  >
                    <Copy className="w-4 h-4 text-gray-500" />
                    Salin Link
                  </button>
                  <button
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-700"
                    onClick={handleShareWhatsApp}
                  >
                    <MessageCircle className="w-4 h-4 text-green-500" />
                    Share on WhatsApp
                  </button>
                  <button
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-700"
                    onClick={handleShare}
                  >
                    <Share2 className="w-4 h-4 text-blue-500" />
                    Share (Web Share)
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default HeroHeader;
