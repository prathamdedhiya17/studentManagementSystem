import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: 'Admin',
};

type DashboardData = {
    totalStudents: number;
    totalCourses: number;
    activeEnrollments: number;
    adminUsers: number;
    // recentActivity: string[];
};

async function getDashboardData(): Promise<DashboardData> {
    // const baseUrl =
    //   process.env.NODE_ENV === 'development'
    //     ? 'http://localhost:3000'
    //     : process.env.NEXT_PUBLIC_BASE_URL!; // Set this in prod

    const res = await fetch(`http://localhost:3000/api/admin`, {
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch dashboard data');
    }

    return res.json();
}

export default async function Admin() {
    const data: DashboardData = await getDashboardData();

    return (
        <div>
            <h2 className="font-semibold text-3xl">Dashboard</h2>
            {/* Data Cards */}
            <div className="my-6 flex gap-8">
                <Card className="gap-0 flex-grow min-w-54">
                    <CardHeader className="whitespace-nowrap">
                        <CardTitle>Total Students</CardTitle>
                    </CardHeader>
                    <CardContent className="font-semibold text-4xl">
                        <p>{data.totalStudents}</p>
                    </CardContent>
                </Card>
                <Card className="gap-0 flex-grow min-w-54">
                    <CardHeader className="whitespace-nowrap">
                        <CardTitle>Total Courses</CardTitle>
                    </CardHeader>
                    <CardContent className="font-semibold text-4xl">
                        <p>{data.totalCourses}</p>
                    </CardContent>
                </Card>
                <Card className="gap-0 flex-grow min-w-54">
                    <CardHeader className="whitespace-nowrap">
                        <CardTitle>Active Enrollments</CardTitle>
                    </CardHeader>
                    <CardContent className="font-semibold text-4xl">
                        <p>{data.activeEnrollments}</p>
                    </CardContent>
                </Card>
                <Card className="gap-0 flex-grow min-w-54">
                    <CardHeader className="whitespace-nowrap">
                        <CardTitle>Total Admins</CardTitle>
                    </CardHeader>
                    <CardContent className="font-semibold text-4xl">
                        <p>{data.adminUsers}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div>
                <h3 className="font-semibold text-2xl mb-2">Quick Actions</h3>
                <div className="flex gap-8">
                    <Button asChild className="cursor-pointer">
                        <Link href="/">
                            <Plus />
                            Add Student
                        </Link>
                    </Button>
                    <Button asChild className="cursor-pointer">
                        <Link href="/">
                            <Plus />
                            Add Course
                        </Link>
                    </Button>
                    <Button asChild className="cursor-pointer">
                        <Link href="/">
                            <Plus />
                            Add Enrollment
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
