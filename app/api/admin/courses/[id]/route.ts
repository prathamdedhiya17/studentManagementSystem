export async function PUT(
    req: Request
) {
    const body = await req.json();

    // Update in DB later
    return Response.json({
        success: true,
        student: { id: Date.now(), ...body },
    });
}

export async function DELETE(
    _: Request,
    { params }: { params: { id: string } }
) {
    const id = parseInt(params.id);
    // Delete from DB later
    return Response.json({ success: true, deletedId: id });
}
