export async function GET() {
    const students = [
        {
            studentID: 1,
            name: 'Alice Johnson',
            email: 'alice.j@iu.edu',
            dob: '2004-05-12',
            enrollments: ['Deep Learning', 'Applied Database Technologies'],
            gpa: 3.7,
            password: 'Abcd@123',
        },
        {
            studentID: 2,
            name: 'Bob Smith',
            email: 'bob.smith@iu.edu',
            dob: '2003-09-20',
            enrollments: ['Statistics', 'Applied Machine Learning'],
            gpa: 3.2,
            password: 'Abcd@123',
        },
        {
            studentID: 3,
            name: 'Carol Diaz',
            dob: '2005-02-28',
            email: 'carol.diaz@example.com',
            enrollments: ['Statistics', 'Applied Machine Learning'],
            gpa: 3.5,
            password: 'Abcd@123',
        },
    ];

    return Response.json(students);
}
