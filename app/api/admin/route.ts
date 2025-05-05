import { createClient } from '@/utils/supabase/server';

export async function GET() {
  const supabase = await createClient();

  // Running all 4 count queries in parallel
  const [students, courses, enrollments, admins] = await Promise.all([
    supabase.from('students').select('*', { count: 'exact', head: true }),
    supabase.from('courses').select('*', { count: 'exact', head: true }),
    supabase.from('enrollments').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('admins').select('*', { count: 'exact', head: true }),
  ]);

  if (students.error || courses.error || enrollments.error || admins.error) {
    return new Response(
      JSON.stringify({
        error: students.error?.message || courses.error?.message || enrollments.error?.message || admins.error?.message,
      }),
      { status: 500 }
    );
  }

  const data = {
    totalStudents: students.count ?? 0,
    totalCourses: courses.count ?? 0,
    activeEnrollments: enrollments.count ?? 0,
    adminUsers: admins.count ?? 0,
  };

  return Response.json(data);
}
