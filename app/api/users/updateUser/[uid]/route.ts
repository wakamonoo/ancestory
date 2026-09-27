import admin from "@/lib/firebase/admin";
import clientPromise from "@/lib/mongodb";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ uid: string }> },
) {
  const { uid } = await params;
  const { name, profilePicture, coverPhoto, bio } = await request.json();

  try {
    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    await db.collection("users").updateOne(
      {
        uid,
      },
      {
        $set: {
          name,
          profilePicture,
          coverPhoto,
          bio,
          updatedAt: new Date(),
        },
      },
    );

    return Response.json({
      success: true,
      message: "user signed up succesfully",
    });
  } catch (err) {
    console.error("failed to create user", err);
    return Response.json(
      {
        success: false,
        message: "failed to create user",
      },
      { status: 500 },
    );
  }
}
