import { NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/server';

type Enrollment = {
    id: string;
    status: string;
    grade: string | null;
    enrollmentdate: string;
    students: { studentid: string } | null;
    courses: { courseid: string } | null;
};

export async function GET() {
    const supabase = await createClient();

    const { data, error } = await supabase.from('enrollments').select(`
      id,
      status,
      grade,
      enrollmentdate,
      students ( studentid ),
      courses ( courseid )
    `);

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
        });
    }

    // Transform the data into clean UI format
    const formatted = (data as unknown as Enrollment[]).map((record) => ({
        id: record.id,
        student_id: record.students?.studentid ?? 'Unknown',
        course_id: record.courses?.courseid ?? 'Unknown',
        enrollmentdate: record.enrollmentdate,
        status: record.status,
        grade: record.grade,
    }));

    return Response.json(formatted);
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const search = body.search;

    const supabase = await createClient();
    const { data, error } = await supabase
        .from('enrollments')
        .select(
            `
        id,
        status,
        grade,
        enrollmentdate,
        students ( studentid ),
        courses ( courseid )
      `
        )
        .eq('id', search).limit(1000);

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
        });
    }

    // Transform the data into clean UI format
    const formatted = (data as unknown as Enrollment[]).map((record) => ({
        id: record.id,
        student_id: record.students?.studentid ?? 'Unknown',
        course_id: record.courses?.courseid ?? 'Unknown',
        enrollmentdate: record.enrollmentdate,
        status: record.status,
        grade: record.grade,
    }));

    return Response.json(formatted);
}
