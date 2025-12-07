import { Skeleton } from "@/components/ui/skeleton";

export function SettingsSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 pt-16 md:pt-8">
                {/* Header */}
                <div className="mb-6">
                    <Skeleton className="h-8 w-32 mb-2" />
                    <Skeleton className="h-4 w-80" />
                </div>

                <div className="space-y-6">
                    {/* Profile Information */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <Skeleton className="h-6 w-40 mb-4" />
                        <div className="space-y-4">
                            <div>
                                <Skeleton className="h-4 w-16 mb-2" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div>
                                <Skeleton className="h-4 w-24 mb-2" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <Skeleton className="h-10 w-32" />
                        </div>
                    </div>

                    {/* Account Information */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <Skeleton className="h-6 w-40 mb-4" />
                        <div className="space-y-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <Skeleton className="w-5 h-5 mt-0.5" />
                                    <div className="flex-1">
                                        <Skeleton className="h-4 w-24 mb-2" />
                                        <Skeleton className="h-5 w-48" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Info Banner */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex gap-3">
                            <Skeleton className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-3 w-full" />
                                <Skeleton className="h-3 w-3/4" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
