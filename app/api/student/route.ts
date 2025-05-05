import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

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
        userID = parsedAuth?.id;
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

    const supabase = await createClient();

    const { data, error } = await supabase
        .from('students')
        .select(
        `
            id,
            studentid,
            name,
            email,
            dob,
            gpa,
            password,
            enrollments (
                status,
                grade,
                courses (
                    courseid,
                    name
                )
            )
        `
        )
        .eq('id', userID)
        .single();

    if (error || !data) {
        return new Response(JSON.stringify({ error: 'Student not found' }), {
            status: 404,
        });
    }

    const formatted = {
        studentid: data.studentid,
        name: data.name,
        email: data.email,
        dob: data.dob,
        gpa: data.gpa,
        password: data.password,
        enrollments: data.enrollments.map((enroll: any) => ({
            courseid: enroll.courses?.courseid ?? 'Unknown',
            name: enroll.courses?.name ?? 'Unknown',
            status: enroll.status,
            grade: enroll.grade,
        })),
    };

    return Response.json(formatted);
}
