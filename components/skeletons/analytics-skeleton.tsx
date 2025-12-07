import { Skeleton } from "@/components/ui/skeleton";

export function AnalyticsSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 pt-16 md:pt-8">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-96" />
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
                            <Skeleton className="h-4 w-32 mb-3" />
                            <Skeleton className="h-8 w-24 mb-2" />
                            <Skeleton className="h-3 w-40" />
                        </div>
                    ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <Skeleton className="h-6 w-48 mb-4" />
                        <Skeleton className="h-64 w-full" />
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <Skeleton className="h-6 w-48 mb-4" />
                        <Skeleton className="h-64 w-full" />
                    </div>
                </div>

                {/* Additional Analytics */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <Skeleton className="h-6 w-40 mb-4" />
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                <div className="flex-1">
                                    <Skeleton className="h-5 w-3/4 mb-2" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                                <Skeleton className="h-8 w-20" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
