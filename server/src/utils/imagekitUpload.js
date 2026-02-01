import imagekit from "../config/imagekit.js";

const uploadToImageKit = async (fileBuffer, fileName, folder) => {
  const result = await imagekit.upload({
    file: fileBuffer,          // buffer
    fileName: fileName,        // image name
    folder: folder,            // e.g. "/avatars" or "/listings"
  });

  return result;
};

export default uploadToImageKit;
