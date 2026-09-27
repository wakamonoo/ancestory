import cloudinary from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return Response.json(
        {
          success: false,
          message: "no file provided",
        },
        { status: 400 },
      );
    }

    if (file.size > 50 * 1024 * 1024) {
      return Response.json(
        {
          success: false,
          message: "file size cannot exceed 50mb",
        },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "AnceStory Uploads/posters",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );

      uploadStream.end(buffer);
    });

    return Response.json({
      success: true,
      url: result.secure_url,
    });
  } catch (err) {
    console.error("failed upload", err);
    return Response.json(
      {
        success: false,
        message: "failed upload",
      },
      { status: 500 },
    );
  }
}
