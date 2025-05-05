import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
    const body = await req.json();

    const { courseid, name, program, sem, desc } = body;

    const supabase = await createClient();
    const { error } = await supabase.from('courses').insert([
        {
            courseid,
            name,
            program,
            sem,
            desc,
        },
    ]);

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
        });
    }

    return Response.json({ success: true });
}
