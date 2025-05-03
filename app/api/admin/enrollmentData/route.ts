export async function GET() {
    const enrollmentData = [
        {
            enrollmentID: 1,
            studentID: 1,
            courseID: 1,
            enrollmentDate: '2025-08-20',
            status: 'active',
            grade: 'A',
        },
        {
            enrollmentID: 2,
            studentID: 1,
            courseID: 2,
            enrollmentDate: '2026-01-10',
            status: 'active',
            grade: null,
        },
        {
            enrollmentID: 3,
            studentID: 2,
            courseID: 3,
            enrollmentDate: '2025-08-21',
            status: 'completed',
            grade: 'B+',
        },
    ];

    return Response.json(enrollmentData);
}
