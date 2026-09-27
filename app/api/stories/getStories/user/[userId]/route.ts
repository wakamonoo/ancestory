import clientPromise from "@/lib/mongodb";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;
  try {
    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    const story = await db
      .collection("stories")
      .find(
        { userId },
        {
          projection: {
            _id: 0,
          },
        },
      )
      .toArray();

    return Response.json({
      success: true,
      story,
    });
  } catch (err) {
    console.error("failed to fetch story", err);
    return Response.json(
      {
        success: false,
        message: "failed to fetch story",
      },
      { status: 500 },
    );
  }
}
