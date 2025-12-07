import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto p-6 sm:p-8 lg:p-12">
                {/* Header */}
                <div className="mb-8">
                    <Skeleton className="h-8 w-32 mb-2" />
                    <Skeleton className="h-4 w-64" />
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    {/* Profile Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
                        <div className="flex items-center gap-4">
                            <Skeleton className="w-16 h-16 rounded-full bg-white/20" />
                            <div>
                                <Skeleton className="h-6 w-48 mb-2 bg-white/30" />
                                <Skeleton className="h-4 w-64 bg-white/20" />
                            </div>
                        </div>
                    </div>

                    {/* Profile Details */}
                    <div className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Skeleton className="h-4 w-20 mb-2" />
                                <Skeleton className="h-6 w-40" />
                            </div>
                            <div>
                                <Skeleton className="h-4 w-16 mb-2" />
                                <Skeleton className="h-6 w-48" />
                            </div>
                            <div className="md:col-span-2">
                                <Skeleton className="h-4 w-28 mb-2" />
                                <Skeleton className="h-8 w-32" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
