import admin from "@/lib/firebase/admin";
import clientPromise from "@/lib/mongodb";

export async function POST(request: Request) {
  const { token } = await request.json();

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const { uid, email, name, picture } = decoded;

    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    await db.collection("users").updateOne(
      {
        uid,
      },
      {
        $setOnInsert: {
          email,
          name,
          picture,
          createdAt: new Date(),
        },
      },
      { upsert: true },
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
