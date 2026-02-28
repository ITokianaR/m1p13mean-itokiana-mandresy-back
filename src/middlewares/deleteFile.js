import fs from 'fs';
import path from 'path';

// Helper to delete a file from storage
const deleteFileFromStorage = (filePath) => {
  if (!filePath) return;
  // filePath is like "/storages/filename.jpg", convert to actual path
  const fullPath = path.join(process.cwd(), filePath);
  fs.unlink(fullPath, (err) => {
    if (err) console.error('Failed to delete file:', fullPath, err);
  });
};

export default deleteFileFromStorage;