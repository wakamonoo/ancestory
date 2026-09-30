import clientPromise from "@/lib/mongodb";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ storyId: string }> },
) {
  try {
    const { storyId } = await params;
    
    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    await db.collection("stories").deleteOne({ storyId });

    return Response.json({
      success: true,
      message: "story deleted succesfully",
    });
  } catch (err) {
    console.error("failed to delete story", err);
    return Response.json(
      {
        success: false,
        message: "failed to delete story",
      },
      { status: 500 },
    );
  }
}
