import { NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
    const supabase = await createClient();

    const { data, error } = await supabase.from('students').select(`
      id,
      studentid,
      name,
      email,
      dob,
      gpa,
      password,
      enrollments (
        courses (
          courseid
        )
      )
    `).limit(1000);

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
        });
    }

    // Transform the data into your desired format
    const students = data.map((student) => ({
        id: student.id,
        studentid: student.studentid,
        name: student.name,
        email: student.email,
        dob: student.dob,
        gpa: student.gpa,
        password: student.password,
        enrollments: student.enrollments
            .map((enroll: any) => enroll.courses?.courseid)
            .filter((id: string | null) => id !== null),
    }));

    return Response.json(students);
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const search = body.search;

    const supabase = await createClient();
    const { data, error } = await supabase.from('students').select(`
      id,
      studentid,
      name,
      email,
      dob,
      gpa,
      password,
      enrollments (
        courses (
          courseid
        )
      )
    `).ilike('name', `%${search}%`).limit(1000);

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
        });
    }

    // Transform the data into your desired format
    const students = data.map((student) => ({
        id: student.id,
        studentid: student.studentid,
        name: student.name,
        email: student.email,
        dob: student.dob,
        gpa: student.gpa,
        password: student.password,
        enrollments: student.enrollments
            .map((enroll: any) => enroll.courses?.courseid)
            .filter((id: string | null) => id !== null),
    }));

    return Response.json(students);
}
