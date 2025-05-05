import Table from './Table';

type EnrollmentData = {
    id: number,
    student_id: number,
    course_id: number,
    enrollmentdate: Date,
    status: string,
    grade: string,
};

async function getEnrollmentDets() {
    const res = await fetch(`http://localhost:3000/api/admin/enrollmentData`, {
        cache: 'no-store',
    });

    if (!res.ok) throw new Error('Failed to fetch Enrollment Data');

    return res.json();
}

export default async function Courses() {
    const courses: EnrollmentData[] = await getEnrollmentDets();
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold border-b-4 border-primary pr-1 w-fit rounded-r-xs mb-4">Enrollment Records</h1>
            <Table initialData={courses} />
        </div>
    );
}
