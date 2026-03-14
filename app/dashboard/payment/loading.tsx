import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 pt-16 md:pt-8">
                <div className="mb-6">
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-72" />
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                    <Skeleton className="h-6 w-40 mb-4" />
                    <div className="space-y-4">
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <Skeleton className="h-6 w-32 mb-4" />
                    <Skeleton className="h-32 w-full" />
                </div>
            </div>
        </div>
    );
}
