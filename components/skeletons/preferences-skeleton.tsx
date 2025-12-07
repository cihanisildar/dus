import { Skeleton } from "@/components/ui/skeleton";

export function PreferencesSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 pt-16 md:pt-8">
                {/* Header */}
                <div className="mb-6">
                    <div className="mb-4">
                        <Skeleton className="h-8 w-48 mb-2" />
                        <Skeleton className="h-4 w-96" />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Skeleton className="h-10 w-48" />
                        <Skeleton className="h-10 w-40" />
                    </div>
                </div>

                {/* Info Banner */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3 mb-6">
                    <Skeleton className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-2/3" />
                    </div>
                </div>

                {/* Preferences List */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-10 w-32" />
                    </div>

                    <div className="space-y-3">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex items-start gap-4">
                                    <Skeleton className="w-8 h-8" />
                                    <div className="flex-1">
                                        <Skeleton className="h-5 w-3/4 mb-2" />
                                        <div className="flex gap-4 mb-2">
                                            <Skeleton className="h-4 w-32" />
                                            <Skeleton className="h-4 w-24" />
                                        </div>
                                        <Skeleton className="h-3 w-full" />
                                    </div>
                                    <Skeleton className="w-8 h-8" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
