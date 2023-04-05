export const blobToBase64 = async (blob: Blob, asDataUrl = false) => {
  const buffer = Buffer.from(await blob.text());

  if (asDataUrl === true) {
    return "data:" + blob.type + ";base64," + buffer.toString("base64");
  }

  return buffer.toString("base64");
};

export function getFileExtension(fileName: string): string | undefined {
  return fileName.toLowerCase().split(".").pop();
}
