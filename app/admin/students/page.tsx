import Table from './Table';

type Student = {
    id: number,
    studentid: string;
    name: string;
    email: string;
    dob: string;
    enrollments: string[];
    gpa: number;
    password: string;
};

async function getStudents() {
    const res = await fetch(`http://localhost:3000/api/admin/students`, {
        cache: 'no-store',
    });

    if (!res.ok) throw new Error('Failed to fetch students');

    return res.json();
}

export default async function StudentPage() {
    const students: Student[] = await getStudents();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold border-b-4 border-primary pr-1 w-fit rounded-r-xs mb-4">Student Records</h1>
            <Table initialData={students} />
        </div>
    );
}
