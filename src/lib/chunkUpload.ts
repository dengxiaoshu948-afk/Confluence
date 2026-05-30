/**
 * Chunked upload helper for large files (10GB+)
 * Splits file into 100MB chunks, uploads them sequentially
 * Supports resume via upload session ID
 */

const CHUNK_SIZE = 100 * 1024 * 1024; // 100MB per chunk

export interface ChunkUploadOptions {
  file: File;
  onProgress?: (uploadedChunks: number, totalChunks: number, currentChunk: number) => void;
  onError?: (error: string) => void;
}

export interface ChunkUploadResult {
  fileUrl: string;
  fileName: string;
  fileSize: number;
  key: string;
}

/**
 * Upload a large file using chunked upload
 * Returns the file info when complete
 */
export async function uploadLargeFile(
  options: ChunkUploadOptions
): Promise<ChunkUploadResult | null> {
  const { file, onProgress } = options;
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

  // 1. Initialize upload session
  const initRes = await fetch("/api/upload/chunk/init", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileName: file.name,
      fileSize: file.size,
      totalChunks,
    }),
  });

  if (!initRes.ok) {
    throw new Error("Failed to initialize upload session");
  }

  const initData = await initRes.json();
  const uploadId = initData.uploadId;

  // 2. Upload each chunk
  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, file.size);
    const chunk = file.slice(start, end);

    const formData = new FormData();
    formData.append("chunk", new Blob([chunk]), `${file.name}.part${i}`);

    const chunkRes = await fetch(`/api/upload/chunk/${uploadId}?index=${i}`, {
      method: "POST",
      body: formData,
    });

    if (!chunkRes.ok) {
      throw new Error(`Failed to upload chunk ${i + 1}/${totalChunks}`);
    }

    onProgress?.(i + 1, totalChunks, i);
  }

  // 3. Finalize - merge chunks
  const finalizeRes = await fetch(`/api/upload/chunk/${uploadId}/finalize`, {
    method: "POST",
  });

  if (!finalizeRes.ok) {
    throw new Error("Failed to finalize upload");
  }

  const result = await finalizeRes.json();
  return {
    fileUrl: result.fileUrl,
    fileName: result.fileName,
    fileSize: result.fileSize,
    key: result.key,
  };
}

/**
 * Check if a file should use chunked upload
 * Files > 1GB use chunked upload
 */
export function shouldUseChunkedUpload(fileSize: number): boolean {
  return fileSize > 1024 * 1024 * 1024; // > 1GB
}
