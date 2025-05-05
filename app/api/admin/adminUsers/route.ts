import { NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
    const supabase = await createClient();
    const { data: adminUsers, error } = await supabase.from('admins').select().limit(1000);

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
        });
    }

    return Response.json(adminUsers);
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const search = body.search;

    const supabase = await createClient();
    const { data: adminUsers, error } = await supabase
        .from('admins')
        .select()
        .ilike('name', `%${search}%`).limit(1000);

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
        });
    }

    return Response.json(adminUsers);
}
