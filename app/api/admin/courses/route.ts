import { NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
    const supabase = await createClient();
    const { data: courses, error } = await supabase.from('courses').select().limit(1000);

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
        });
    }

    return Response.json(courses);
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const search = body.search;

    const supabase = await createClient();
    const { data: courses, error } = await supabase
        .from('courses')
        .select()
        .ilike('name', `%${search}%`).limit(1000);

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
        });
    }

    return Response.json(courses);
}
