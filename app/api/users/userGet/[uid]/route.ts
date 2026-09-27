import clientPromise from "@/lib/mongodb";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ uid: string }> },
) {
  const { uid } = await params;
  try {
    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    const result = await db.collection("users").findOne({ uid });

    return Response.json({
      success: true,
      result,
    });
  } catch (err) {
    console.error("failed to fetch user", err);
    return Response.json(
      {
        success: false,
        message: "failed to fetch user",
      },
      { status: 500 },
    );
  }
}
