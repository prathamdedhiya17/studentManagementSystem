export async function GET() {
    const courses = [
        {
            courseID: 1,
            name: 'Intro to Computer Science',
            program: 'Computer Science',
            sem: 'Fall 2025',
            desc: 'Fundamentals of computer science.',
        },
        {
            courseID: 2,
            name: 'Data Structures',
            program: 'Computer Science',
            sem: 'Spring 2026',
            desc: 'Linked lists, trees, and more.',
        },
        {
            courseID: 3,
            name: 'Digital Circuits',
            program: 'Electrical Engineering',
            sem: 'Fall 2025',
            desc: 'Logic gates and circuit analysis.',
        },
    ];

    return Response.json(courses);
}
