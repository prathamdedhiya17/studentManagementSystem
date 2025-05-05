import { Skeleton } from '@/components/ui/skeleton';

export default function TableSkeleton() {
    return (
        <>
            <div className="flex justify-between px-2 mt-16">
                <Skeleton className="h-8 w-96" />
                <Skeleton className="h-8 w-44" />
            </div>
            <Skeleton className="w-full h-96 mt-8 px-4 py-6 rounded-lg">
                <div className="flex">
                    <Skeleton className="mx-3 w-44 h-8" />
                    <Skeleton className="mx-3 w-44 h-8" />
                    <Skeleton className="mx-3 w-44 h-8 hidden md:block" />
                    <Skeleton className="mx-3 w-44 h-8 hidden md:block" />
                    <Skeleton className="mx-3 w-44 h-8 hidden md:block" />
                    <Skeleton className="mx-3 w-44 h-8 hidden md:block" />
                </div>
                <div className="flex mt-6">
                    <Skeleton className="mx-3 w-44 h-8" />
                    <Skeleton className="mx-3 w-44 h-8" />
                    <Skeleton className="mx-3 w-44 h-8 hidden md:block" />
                    <Skeleton className="mx-3 w-44 h-8 hidden md:block" />
                    <Skeleton className="mx-3 w-44 h-8 hidden md:block" />
                    <Skeleton className="mx-3 w-44 h-8 hidden md:block" />
                </div>
                <div className="flex mt-4">
                    <Skeleton className="mx-3 w-44 h-8" />
                    <Skeleton className="mx-3 w-44 h-8" />
                    <Skeleton className="mx-3 w-44 h-8 hidden md:block" />
                    <Skeleton className="mx-3 w-44 h-8 hidden md:block" />
                    <Skeleton className="mx-3 w-44 h-8 hidden md:block" />
                    <Skeleton className="mx-3 w-44 h-8 hidden md:block" />
                </div>
                <div className="flex mt-4">
                    <Skeleton className="mx-3 w-44 h-8" />
                    <Skeleton className="mx-3 w-44 h-8" />
                    <Skeleton className="mx-3 w-44 h-8 hidden md:block" />
                    <Skeleton className="mx-3 w-44 h-8 hidden md:block" />
                    <Skeleton className="mx-3 w-44 h-8 hidden md:block" />
                    <Skeleton className="mx-3 w-44 h-8 hidden md:block" />
                </div>
                <div className="flex mt-4">
                    <Skeleton className="mx-3 w-44 h-8" />
                    <Skeleton className="mx-3 w-44 h-8" />
                    <Skeleton className="mx-3 w-44 h-8 hidden md:block" />
                    <Skeleton className="mx-3 w-44 h-8 hidden md:block" />
                    <Skeleton className="mx-3 w-44 h-8 hidden md:block" />
                    <Skeleton className="mx-3 w-44 h-8 hidden md:block" />
                </div>
                <div className="flex mt-4">
                    <Skeleton className="mx-3 w-44 h-8" />
                    <Skeleton className="mx-3 w-44 h-8" />
                    <Skeleton className="mx-3 w-44 h-8 hidden md:block" />
                    <Skeleton className="mx-3 w-44 h-8 hidden md:block" />
                    <Skeleton className="mx-3 w-44 h-8 hidden md:block" />
                    <Skeleton className="mx-3 w-44 h-8 hidden md:block" />
                </div>
                <div className="flex mt-4">
                    <Skeleton className="mx-3 w-44 h-8" />
                    <Skeleton className="mx-3 w-44 h-8" />
                    <Skeleton className="mx-3 w-44 h-8 hidden md:block" />
                    <Skeleton className="mx-3 w-44 h-8 hidden md:block" />
                    <Skeleton className="mx-3 w-44 h-8 hidden md:block" />
                    <Skeleton className="mx-3 w-44 h-8 hidden md:block" />
                </div>
            </Skeleton>
        </>
    );
}
