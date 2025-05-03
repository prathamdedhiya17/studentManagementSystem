export async function GET() {
    const enrollmentData = [
        {
            adminID: 1,
            name: 'Alice Bore',
            email: 'admin.alice@example.com',
            password: 'Hashed_pw_1',
            role: 'super-admin',
        },
        {
            adminID: 2,
            name: 'Jameson Welsh',
            email: 'jameson.admin@example.com',
            password: 'Hashed_pw_2',
            role: 'teacher',
        },
    ];

    return Response.json(enrollmentData);
}
