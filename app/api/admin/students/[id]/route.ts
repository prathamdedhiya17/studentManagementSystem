import { createClient } from '@/utils/supabase/server';

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    const body = await req.json();
    const {
        name,
        email,
        studentid,
        dob,
        gpa,
        password,
        enrollments,
        confirmPassword,
    } = body;

    const supabase = await createClient();

    const { error } = await supabase
        .from('students')
        .update({
            name,
            email,
            studentid,
            dob,
            gpa,
            password,
            enrollments,
            confirmPassword,
        })
        .eq('id', parseInt(params.id));

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
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
        .from('students')
        .delete()
        .eq('id', parseInt(params.id));

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
        });
    }

    return Response.json({ success: true });
}
