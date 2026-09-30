import admin from "@/lib/firebase/admin";
import clientPromise from "@/lib/mongodb";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ uid: string }> },
) {
  try {
    const { uid } = await params;

    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    await db.collection("stories").deleteMany({ userId: uid });

    await db.collection("users").deleteOne({ uid });

    return Response.json({
      success: true,
      message: "user deleted succesfully",
    });
  } catch (err) {
    console.error("failed to delete account", err);
    return Response.json(
      {
        success: false,
        message: "failed to delete account",
      },
      { status: 500 },
    );
  }
}
