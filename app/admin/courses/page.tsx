import Table from './Table';

type Course = {
    courseID: number;
    name: string;
    program: string;
    sem: string;
    desc: string;
};

async function getCourses() {
    const res = await fetch(`http://localhost:3000/api/admin/courses`, {
        cache: 'no-store',
    });

    if (!res.ok) throw new Error('Failed to fetch Courses');

    return res.json();
}

export default async function Courses() {
    const courses: Course[] = await getCourses();
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold border-b-4 border-primary pr-1 w-fit rounded-r-xs mb-4">Available Courses</h1>
            <Table initialData={courses} />
        </div>
    );
}
