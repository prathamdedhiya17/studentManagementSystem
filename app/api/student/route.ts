import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const authCookie = request.cookies.get('auth')?.value;

    if (!authCookie) {
        return NextResponse.json(
            { error: 'User not authenticated' },
            { status: 401 }
        );
    }

    // Parse the JSON stored in 'auth' cookie
    let userID;
    try {
        const parsedAuth = JSON.parse(authCookie);
        userID = parsedAuth?.userID;
    } catch (error) {
        return NextResponse.json(
            { error: 'Invalid auth cookie' },
            { status: 400 }
        );
    }

    // If no userID found in cookie, return an error
    if (!userID) {
        return NextResponse.json(
            { error: 'No userID found in auth cookie' },
            { status: 400 }
        );
    }

    const students = [
        {
            studentID: 1,
            name: 'Alice Johnson',
            email: 'alice.j@iu.edu',
            dob: '2004-05-12',
            enrollments: [
                {
                    courseID: 'DL501',
                    course: 'Deep Learning',
                    status: 'In Progress',
                    grade: '-',
                },
                {
                    courseID: 'ADT401',
                    course: 'Applied Database Technologies',
                    status: 'completed',
                    grade: 'A+',
                },
            ],
            gpa: 3.7,
            password: 'Abcd@123',
        },
        {
            studentID: 2,
            name: 'Bob Smith',
            email: 'bob.smith@iu.edu',
            dob: '2003-09-20',
            enrollments: [
                {
                    courseID: 'S522',
                    course: 'Statistics',
                    status: 'In Progress',
                    grade: '-',
                },
                {
                    courseID: 'AML402',
                    course: 'Applied Machine Learning',
                    status: 'completed',
                    grade: 'B',
                },
            ],
            gpa: 3.2,
            password: 'Abcd@123',
        },
        {
            studentID: 3,
            name: 'Carol Diaz',
            dob: '2005-02-28',
            email: 'carol.diaz@example.com',
            enrollments: [
                {
                    courseID: 'S522',
                    course: 'Statistics',
                    status: 'In Progress',
                    grade: '-',
                },
                {
                    courseID: 'AML402',
                    course: 'Applied Machine Learning',
                    status: 'completed',
                    grade: 'B',
                },
            ],
            gpa: 3.5,
            password: 'Abcd@123',
        },
    ];

    const student = students.find((s) => s.studentID === userID);

    return NextResponse.json(student ?? { error: 'Student not found' }, {
        status: student ? 200 : 404,
    });
}
