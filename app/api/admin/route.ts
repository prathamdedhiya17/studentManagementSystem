import * as z from 'zod';

const dashboadData = z.object({
    totalStudents: z.number(),
    totalCourses: z.number(),
    activeEnrollments: z.number(),
    adminUsers: z.number(),
});

export async function GET() {
    const data = {
        totalStudents: 3,
        totalCourses: 3,
        activeEnrollments: 3,
        adminUsers: 2,
        // recentActivity: [
        //     'Alice Johnson enrolled in Introduction to Computer Science',
        //     'New course added: Data Structures',
        // ],
    };

    return Response.json(dashboadData.parse(data));
}
