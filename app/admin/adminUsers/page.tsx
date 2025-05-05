import Table from './Table';

type Admin = {
    id: number;
    name: string;
    email: string;
    password: string;
    role: string;
};

async function getStudents() {
    const res = await fetch(`http://localhost:3000/api/admin/adminUsers`, {
        cache: 'no-store',
    });

    if (!res.ok) throw new Error('Failed to fetch Admin Data');

    return res.json();
}

export default async function StudentPage() {
    const students: Admin[] = await getStudents();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold border-b-4 border-primary pr-1 w-fit rounded-r-xs mb-4">Admin List</h1>
            <Table initialData={students} />
        </div>
    );
}
