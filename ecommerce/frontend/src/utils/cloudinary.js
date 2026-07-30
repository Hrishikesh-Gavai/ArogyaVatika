export const uploadToCloudinary = async (file) => {
  const cloudName = 'djtdivrqu';
  const uploadPreset = 'ecommerce_upload';

  console.log('🚀 Starting Cloudinary Upload', {
    cloudName,
    uploadPreset,
    file: {
      name: file.name,
      size: file.size,
      type: file.type
    }
  });

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('cloud_name', cloudName);

  try {
    console.log('📤 Sending request to Cloudinary...');
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    console.log('📥 Response received:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Upload failed with response:', errorText);
      throw new Error(`Upload failed: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Upload successful!', {
      url: data.secure_url,
      public_id: data.public_id,
      format: data.format
    });
    
    return data.secure_url;

  } catch (error) {
    console.error('💥 Upload error:', error);
    throw error;
  }
};