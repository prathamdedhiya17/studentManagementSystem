import { createClient } from '@/utils/supabase/server';

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    const body = await req.json();

    const { courseid, name, program, sem, desc } = body;
    const supabase = await createClient();

    const { error } = await supabase
        .from('courses')
        .update({
            courseid,
            name,
            program,
            sem,
            desc,
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
        .from('courses')
        .delete()
        .eq('id', parseInt(params.id));

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
        });
    }

    return Response.json({ success: true });
}
