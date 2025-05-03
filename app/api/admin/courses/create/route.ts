export async function POST(req: Request) {
    const body = await req.json();
    // Store to DB later

    return Response.json({
        success: true,
        student: { id: Date.now(), ...body },
    });
}
