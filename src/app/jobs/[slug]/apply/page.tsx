"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Upload, FileText, DollarSign, Briefcase } from "lucide-react";
import { useJobBySlug } from "@/hooks/useJobs";
import { useAuthStore } from "@/lib/zustand/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import formatCurrency from "@/lib/formatCurrency";
import { submitApplication } from "@/fetch/applicationFetch";
import { validateFile, formatSalaryInput, extractSalaryValue } from "@/validation/application.validation";
import Image from "next/image";
import { apiCall } from "@/helper/apiCall";
import { isAxiosError } from "axios";

interface ApplicationFormData {
    expected_salary: string;
    cv: File | null;
}

export default function ApplyJobPage() {
    // useAuthRole('USER')
    const router = useRouter();
    const params = useParams();
    const slug = params.slug as string;
    const { job: currentJob, loading, error } = useJobBySlug(slug);

    const [formData, setFormData] = useState<ApplicationFormData>({
        expected_salary: "",
        cv: null,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [dragActive, setDragActive] = useState(false);
    const [checkLoading, setCheckLoading] = useState(false)

    const checkIfAlreadySubmit = async () => {
        setCheckLoading(true)
        try {
            await apiCall.get(`/preselection/check-if-already-submit/${currentJob?.job_id}`)
        } catch (error) {
            if (isAxiosError(error)) {
                if (error.status === 403) {
                    return router.replace(`/selection/${currentJob?.slug}`)
                }
            }
        } finally {
            setCheckLoading(false)
        }
    }

    useEffect(() => {
        if (currentJob?.preselection_test) {
            checkIfAlreadySubmit()
        }
    }, [currentJob?.preselection_test])

    // Handle file upload
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const validationError = validateFile(file);
            if (validationError) {
                setSubmitError(validationError);
                return;
            }
            setFormData(prev => ({ ...prev, cv: file }));
            setSubmitError("");
        }
    };

    // Handle drag and drop
    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            const validationError = validateFile(file);
            if (validationError) {
                setSubmitError(validationError);
                return;
            }
            setFormData(prev => ({ ...prev, cv: file }));
            setSubmitError("");
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError("");

        // Validation
        if (!formData.expected_salary) {
            setSubmitError("Expected salary is required.");
            return;
        }

        if (!formData.cv) {
            setSubmitError("CV upload is required.");
            return;
        }

        const salaryNum = extractSalaryValue(formData.expected_salary);
        if (isNaN(salaryNum) || salaryNum <= 0) {
            setSubmitError("Please enter a valid salary amount.");
            return;
        }

        if (salaryNum < 1000000) {
            setSubmitError("Minimum salary should be at least Rp 1,000,000");
            return;
        }

        if (salaryNum > 1000000000) {
            setSubmitError("Maximum salary should not exceed Rp 1,000,000,000");
            return;
        }

        setIsSubmitting(true);

        try {
            await submitApplication({
                expected_salary: salaryNum,
                cv: formData.cv,
                job_id: currentJob?.job_id || 0,
            });

            // Redirect to My Applications dashboard after successful apply
            router.push(`/dashboard/my-applications`);

        } catch (error: any) {
            console.error('Application submission error:', error);
            setSubmitError(error.message || "Failed to submit application. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Format salary input with currency
    const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        const formatted = formatSalaryInput(value);
        setFormData(prev => ({
            ...prev,
            expected_salary: formatted
        }));
    };

    if (loading || checkLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading job details...</p>
                </div>
            </div>
        );
    }

    if (error || !currentJob) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">Job not found or error loading job details.</p>
                    <Button onClick={() => router.push('/jobs')} variant="outline">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Jobs
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            onClick={() => router.back()}
                            className="p-2"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Apply for Position</h1>
                            <p className="text-gray-600">Submit your application</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Job Summary Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-8">
                            <div className="flex items-center gap-3 mb-4">
                                {currentJob.Company?.logo ? (
                                    <Image
                                        src={currentJob.Company.logo}
                                        alt={currentJob.Company.name}
                                        width={48}
                                        height={48}
                                        className="w-12 h-12 object-cover rounded-lg"
                                    />
                                ) : (
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">
                                            {currentJob.Company?.name?.charAt(0) || 'C'}
                                        </span>
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-semibold text-gray-900">{currentJob.Company?.name}</h3>
                                    <p className="text-sm text-gray-600">{currentJob.location}</p>
                                </div>
                            </div>

                            <h2 className="text-xl font-bold text-gray-900 mb-2">{currentJob.title}</h2>

                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <Briefcase className="w-4 h-4 text-gray-400" />
                                    <span>{currentJob.job_type}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-gray-400" />
                                    <span>{formatCurrency(currentJob.salary || 0)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Application Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border">
                            <div className="p-6 border-b">
                                <h2 className="text-xl font-bold text-gray-900">Application Details</h2>
                                <p className="text-gray-600 mt-1">Please fill in your application information</p>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                {submitError && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <p className="text-red-800 text-sm">{submitError}</p>
                                    </div>
                                )}

                                {/* Expected Salary */}
                                <div className="space-y-2">
                                    <Label htmlFor="expected_salary">Expected Salary *</Label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <Input
                                            id="expected_salary"
                                            name="expected_salary"
                                            value={formData.expected_salary}
                                            onChange={handleSalaryChange}
                                            placeholder="e.g., Rp 10,000,000"
                                            className="pl-10"
                                            required
                                        />
                                    </div>
                                    <p className="text-sm text-gray-500">Enter your expected monthly salary in IDR</p>
                                </div>

                                {/* CV Upload */}
                                <div className="space-y-2">
                                    <Label htmlFor="cv">Upload CV/Resume *</Label>
                                    <div
                                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragActive
                                            ? 'border-blue-400 bg-blue-50'
                                            : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                    >
                                        <input
                                            type="file"
                                            id="cv"
                                            accept=".pdf,.doc,.docx"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />

                                        {formData.cv ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <FileText className="w-6 h-6 text-green-600" />
                                                <span className="text-green-600 font-medium">{formData.cv.name}</span>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setFormData(prev => ({ ...prev, cv: null }))}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        ) : (
                                            <div>
                                                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                                <p className="text-gray-600 mb-1">
                                                    <label htmlFor="cv" className="cursor-pointer text-blue-600 hover:text-blue-700">
                                                        Click to upload
                                                    </label>
                                                    {' '}or drag and drop
                                                </p>
                                                <p className="text-sm text-gray-500">PDF, DOC, or DOCX (max 5MB)</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex gap-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.back()}
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting || !formData.cv || !formData.expected_salary}
                                        className="flex-1"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Submitting...
                                            </>
                                        ) : (
                                            'Submit Application'
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}