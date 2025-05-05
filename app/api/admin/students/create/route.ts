import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
    const body = await req.json();

    const { studentid, name, email, dob, gpa, password } = body;

    const supabase = await createClient();
    const { error } = await supabase.from('students').insert([
        {
            studentid,
            name,
            email,
            dob,
            gpa,
            password,
        },
    ]);

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
        });
    }

    return Response.json({ success: true });
}
