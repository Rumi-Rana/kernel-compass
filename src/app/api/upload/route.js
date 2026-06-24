import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'dshq0jxlb',
  api_key: '975981512368728',
  api_secret: 'X4Rh_Xhh2h5VjlG2CT6L74PtD94',
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    if (!file) return Response.json({ error: 'No file' }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    const optimizedUrl = result.secure_url.replace('/upload/', '/upload/f_auto,q_auto/');
    return Response.json({ url: optimizedUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return Response.json({ error: 'Upload failed' }, { status: 500 });
  }
}