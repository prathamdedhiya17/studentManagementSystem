import * as z from 'zod';

const dashboadData = z.object({
    totalStudents: z.number(),
    totalCourses: z.number(),
    activeEnrollments: z.number(),
    adminUsers: z.number(),
});

export async function GET() {
    const data = {
        totalStudents: 1250,
        totalCourses: 35,
        activeEnrollments: 1072,
        adminUsers: 5,
        // recentActivity: [
        //     'Alice Johnson enrolled in Introduction to Computer Science',
        //     'New course added: Data Structures',
        // ],
    };

    return Response.json(dashboadData.parse(data));
}
