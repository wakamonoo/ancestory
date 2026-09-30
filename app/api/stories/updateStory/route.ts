import clientPromise from "@/lib/mongodb";

export async function PUT(request: Request) {
  try {
    const {
      storyId,
      userId,
      title,
      place,
      location,
      poster,
      story,
      source,
      categories,
      readingTime,
    } = await request.json();

    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    const updatedStory = {
      storyId,
      userId,
      title,
      place,
      location,
      poster,
      story,
      source,
      categories,
      readingTime,
      lastUpdatedAt: new Date(),
    };

    await db.collection("stories").updateOne(
      {
        storyId,
        userId,
      },
      {
        $set: updatedStory,
      },
    );

    return Response.json({
      success: true,
      message: "story updated succesfully",
      story: updatedStory,
    });
  } catch (err) {
    console.error("failed to update story", err);
    return Response.json(
      {
        success: false,
        message: "failed to update story",
      },
      { status: 500 },
    );
  }
}
