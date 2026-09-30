import clientPromise from "@/lib/mongodb";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const {
      userId,
      title,
      place,
      location,
      url,
      story,
      source,
      categories,
      readingTime,
    } = await request.json();

    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    const newStory = {
      storyId: `story-${uuidv4()}`,
      userId,
      title,
      place,
      location,
      poster: url,
      story,
      source,
      categories,
      readingTime,
      createdAt: new Date(),
    };

    await db.collection("stories").insertOne(newStory);

    return Response.json({
      success: true,
      message: "story added succesfully",
      story: newStory,
    });
  } catch (err) {
    console.error("failed add story", err);
    return Response.json(
      {
        success: false,
        message: "failed add story",
      },
      { status: 500 },
    );
  }
}
