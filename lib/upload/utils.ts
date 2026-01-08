const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024;
const MAX_DIMENSION = 2400;
const JPEG_QUALITY = 0.85;

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateFile(file: File): ValidationResult {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: "지원하지 않는 파일 형식입니다" };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: "파일 크기가 20MB를 초과합니다" };
  }

  return { valid: true };
}

export async function resizeImage(file: File): Promise<{ blob: Blob; width: number; height: number }> {
  const img = await createImageBitmap(file);

  let { width, height } = img;

  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");

  ctx.drawImage(img, 0, 0, width, height);

  const blob = await canvas.convertToBlob({
    type: "image/jpeg",
    quality: JPEG_QUALITY,
  });

  return { blob, width, height };
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percent: number;
}

export function uploadWithProgress(
  url: string,
  file: Blob,
  onProgress?: (progress: UploadProgress) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress({
          loaded: e.loaded,
          total: e.total,
          percent: Math.round((e.loaded / e.total) * 100),
        });
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        resolve();
      } else {
        reject(new Error(`Upload failed: ${xhr.status}`));
      }
    });

    xhr.addEventListener("error", () => reject(new Error("Network error")));
    xhr.addEventListener("abort", () => reject(new Error("Upload cancelled")));

    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", "image/jpeg");
    xhr.send(file);
  });
}

export interface UploadResult {
  key: string;
  publicUrl: string;
  width: number;
  height: number;
}

export async function uploadGalleryImage(
  invitationId: string,
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> {
  const validation = validateFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const { blob, width, height } = await resizeImage(file);

  const presignResponse = await fetch("/api/upload/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      invitationId,
      filename: file.name,
      contentType: "image/jpeg",
      fileSize: blob.size,
    }),
  });

  if (!presignResponse.ok) {
    const error = await presignResponse.json();
    throw new Error(error.error || "Failed to get upload URL");
  }

  const { uploadUrl, key, publicUrl } = await presignResponse.json();

  await uploadWithProgress(uploadUrl, blob, onProgress);

  const completeResponse = await fetch("/api/upload/complete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      invitationId,
      key,
      originalName: file.name,
      width,
      height,
    }),
  });

  if (!completeResponse.ok) {
    const error = await completeResponse.json();
    throw new Error(error.error || "Failed to complete upload");
  }

  return { key, publicUrl, width, height };
}

const CONCURRENT_UPLOADS = 3;

export interface MultiUploadResult {
  succeeded: UploadResult[];
  failed: { file: File; error: string }[];
}

export async function uploadMultipleImages(
  invitationId: string,
  files: File[],
  onFileProgress?: (fileIndex: number, progress: UploadProgress) => void,
  onFileComplete?: (fileIndex: number, result: UploadResult | null, error?: string) => void
): Promise<MultiUploadResult> {
  const queue = files.map((file, index) => ({ file, index }));
  const succeeded: UploadResult[] = [];
  const failed: { file: File; error: string }[] = [];

  async function worker() {
    while (queue.length > 0) {
      const item = queue.shift();
      if (!item) break;

      const { file, index } = item;

      try {
        const result = await uploadGalleryImage(
          invitationId,
          file,
          (progress) => onFileProgress?.(index, progress)
        );
        succeeded.push(result);
        onFileComplete?.(index, result);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Upload failed";
        failed.push({ file, error: errorMessage });
        onFileComplete?.(index, null, errorMessage);
      }
    }
  }

  const workerCount = Math.min(CONCURRENT_UPLOADS, files.length);
  await Promise.all(Array(workerCount).fill(null).map(() => worker()));

  return { succeeded, failed };
}
