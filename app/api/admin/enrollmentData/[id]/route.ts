import { createClient } from '@/utils/supabase/server';

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    const supabase = await createClient();
        const body = await req.json();
    
        const { student_id, course_id, status, grade } = body;
    
        // 1. Resolve studentid to internal student_id
        const { data: student, error: studentError } = await supabase
            .from('students')
            .select('id')
            .eq('studentid', student_id)
            .single();
    
        if (studentError || !student) {
            return new Response(
                JSON.stringify({ error: `Student not found: ${student_id}` }),
                { status: 400 }
            );
        }
    
        // 2. Resolve courseid to internal course_id
        const { data: course, error: courseError } = await supabase
            .from('courses')
            .select('id')
            .eq('courseid', course_id)
            .single();
    
        if (courseError || !course) {
            return new Response(
                JSON.stringify({ error: `Course not found: ${course_id}` }),
                { status: 400 }
            );
        }
    
        // 3. Update enrollment
        const { error: insertError } = await supabase.from('enrollments').update([
            {
                student_id: student.id,
                course_id: course.id,
                status,
                grade,
            },
        ]).eq('id', parseInt(params.id));
    
        if (insertError) {
            return new Response(JSON.stringify({ error: insertError.message }), {
                status: 500,
            });
        }
    
        return Response.json({ success: true });
}

export async function DELETE(
    _: Request,
    { params }: { params: { id: string } }
) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('enrollments')
        .delete()
        .eq('id', parseInt(params.id));

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
        });
    }

    return Response.json({ success: true });
}
