'use client';

import { useEffect, useState } from 'react';

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ColumnDef } from '@tanstack/react-table';
import { APIdateFormatter } from '../utils/dateFormatter';
import { DataTable } from '@/components/datatableComponent/DataTable';

type Student = {
    studentID: number;
    name: string;
    email: string;
    dob: string;
    enrollments: {
        courseID: string;
        course: string;
        status: string;
        grade: string;
    }[];
    gpa: number;
    password: string;
};

export default function Student() {
    const [student, setStudent] = useState<Student | null>(null);

    useEffect(() => {
        fetch(`http://localhost:3000/api/student`, {
            credentials: 'include',
            cache: 'no-store',
        })
            .then((res) => res.json())
            .then((data) => setStudent(data));
    }, []);

    console.log(student);
    if (student === null) {
        return 'Loading...';
    }

    const columns: ColumnDef<Student['enrollments'][number]>[] = [
        {
            accessorKey: 'courseID',
            header: () => {
                return <div className="text-center">Course ID</div>;
            },
            cell: ({ row }) => (
                <div className="text-center">{row.getValue('courseID')}</div>
            ),
        },
        {
            accessorKey: 'course',
            header: () => <div className="text-center">Course</div>,
            cell: ({ row }) => (
                <div className="text-center">{row.getValue('course')}</div>
            ),
        },
        {
            accessorKey: 'status',
            header: () => {
                return <div className="text-center">Status</div>;
            },
            cell: ({ row }) => (
                <div className="text-center">{row.getValue('status')}</div>
            ),
        },
        {
            accessorKey: 'grade',
            header: () => {
                return <div className="text-center">Grade</div>;
            },
            cell: ({ row }) => (
                <div className="text-center">{row.getValue('grade')}</div>
            ),
        },
    ];

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="font-bold text-2xl">{student.name}</h1>

            {/* Data Cards */}
            <div className="my-6 flex gap-8">
                <Card className="gap-0 flex-grow min-w-54">
                    <CardHeader className="whitespace-nowrap text-primary">
                        <CardTitle>Email</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xl">
                        <p>{student.email}</p>
                    </CardContent>
                </Card>
                <Card className="gap-0 flex-grow min-w-54">
                    <CardHeader className="whitespace-nowrap text-primary">
                        <CardTitle>Date of Birth</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xl">
                        <p>{student.dob}</p>
                    </CardContent>
                </Card>
                <Card className="gap-0 flex-grow min-w-54">
                    <CardHeader className="whitespace-nowrap text-primary">
                        <CardTitle>GPA</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xl">
                        <p>{student.gpa} / 4</p>
                    </CardContent>
                </Card>
            </div>

            <h2 className="font-semibold text-2xl border-b-4 border-primary pr-1 w-fit rounded-r-xs mb-4 mt-12">
                Enrollments
            </h2>
            <DataTable columns={columns} data={student.enrollments} />

            <h2 className="font-semibold text-2xl border-b-4 border-primary pr-1 w-fit rounded-r-xs mb-2 mt-8">
                Announcements
            </h2>
            <ul className='list-disc pl-5'>
                <li>Reminder: Project Proposal due on April 29.</li>
                <li>New announcement: Semester grades will be posted on May 15.</li>
            </ul>
        </div>
    );
}
