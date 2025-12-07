import { Skeleton } from "@/components/ui/skeleton";

export function VerifySkeleton() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-2xl mx-auto p-6 sm:p-8 lg:p-12">
                {/* Header */}
                <div className="mb-8">
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-80" />
                </div>

                {/* Active Period Info */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-6">
                    <div className="flex items-start gap-4">
                        <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
                        <div className="flex-1">
                            <Skeleton className="h-6 w-40 mb-2" />
                            <Skeleton className="h-5 w-56 mb-3" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
                    <div className="space-y-6">
                        <div>
                            <Skeleton className="h-4 w-32 mb-2" />
                            <Skeleton className="h-10 w-full mb-2" />
                            <Skeleton className="h-3 w-64" />
                        </div>

                        {/* Info Box */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex gap-3">
                                <Skeleton className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-40" />
                                    <Skeleton className="h-3 w-full" />
                                    <Skeleton className="h-3 w-full" />
                                    <Skeleton className="h-3 w-3/4" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-4 w-48 mx-auto" />
                </div>
            </div>
        </div>
    );
}
