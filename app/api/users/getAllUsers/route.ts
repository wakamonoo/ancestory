import clientPromise from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    const result = await db.collection("users").find().toArray();

    return Response.json({
      success: true,
      result,
    });
  } catch (err) {
    console.error("failed to fetch users", err);
    return Response.json(
      {
        success: false,
        message: "failed to fetch users",
      },
      { status: 500 },
    );
  }
}
