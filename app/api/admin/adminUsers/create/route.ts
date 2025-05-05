import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
    const body = await req.json();

    const { name, email, password, role } = body;

    const supabase = await createClient();
    const { error } = await supabase.from('admins').insert([
        {
            name,
            email,
            role,
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
