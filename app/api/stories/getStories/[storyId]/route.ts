import clientPromise from "@/lib/mongodb";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ storyId: string }> },
) {
  const { storyId } = await params;
  try {
    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    const stories = db.collection("stories");

    const story = await db.collection("stories").findOne(
      { storyId },
      {
        projection: {
          _id: 0,
        },
      },
    );

    if (!story) {
      return Response.json(
        {
          success: false,
          message: "story not found",
        },
        { status: 404 },
      );
    }

    const previous = await stories
      .find(
        {
          createdAt: { $lt: story.createdAt },
        },
        {
          projection: {
            _id: 0,
            storyId: 1,
            title: 1,
            place: 1,
          },
        },
      )
      .sort({ createdAt: -1 })
      .limit(1)
      .next();

    const next = await stories
      .find(
        {
          createdAt: { $gt: story.createdAt },
        },
        {
          projection: {
            _id: 0,
            storyId: 1,
            title: 1,
            place:1,
          },
        },
      )
      .sort({ createdAt: -1 })
      .limit(1)
      .next();

    return Response.json({
      success: true,
      story,
      previous,
      next,
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
