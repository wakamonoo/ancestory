import clientPromise from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    const stories = await db
      .collection("stories")
      .find({})
      .sort({ createdAt: 1 })
      .toArray();

    const today = new Date();

    const dayNumber = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));

    const index = dayNumber % stories.length;

    const featuredStory = stories[index];

    return Response.json({
      success: true,
      story: featuredStory,
    });
  } catch (err) {
    console.error("failed to fetch featured story", err);
    return Response.json(
      {
        success: false,
        message: "failed to fetch featured story",
      },
      { status: 500 },
    );
  }
}
