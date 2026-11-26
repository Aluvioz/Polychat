export const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;

const MIME_BY_EXTENSION = Object.freeze({
  pdf: "application/pdf",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
});

function safeFilename(value) {
  if (typeof value !== "string") return "";
  return value
    .replace(/\\/g, "/")
    .split("/")
    .pop()
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .trim();
}

function hasPdfSignature(bytes) {
  if (bytes.length < 10) return false;
  const header = String.fromCharCode(...bytes.subarray(0, 5));
  if (header !== "%PDF-") return false;
  const tail = new TextDecoder("latin1").decode(
    bytes.subarray(Math.max(0, bytes.length - 1024)),
  );
  return tail.includes("%%EOF");
}

function hasJpegSignature(bytes) {
  if (bytes.length < 5 || bytes[0] !== 0xff || bytes[1] !== 0xd8 || bytes[2] !== 0xff) {
    return false;
  }
  const start = Math.max(2, bytes.length - 64);
  for (let index = bytes.length - 1; index >= start; index -= 1) {
    if (bytes[index - 1] === 0xff && bytes[index] === 0xd9) return true;
  }
  return false;
}

/**
 * Validates the declared format against the filename and the file's binary
 * signature. This is an initial format check, not a full parser or malware scan.
 */
export function validateAttachment({ filename, mimeType, bytes }) {
  const normalizedFilename = safeFilename(filename);
  if (!normalizedFilename || !(bytes instanceof Uint8Array)) {
    return { ok: false, status: 400, reason: "invalid_file" };
  }

  if (bytes.length === 0) {
    return { ok: false, status: 400, reason: "empty_file" };
  }

  if (bytes.length > MAX_ATTACHMENT_BYTES) {
    return { ok: false, status: 413, reason: "file_too_large" };
  }

  const extension = normalizedFilename.includes(".")
    ? normalizedFilename.split(".").pop().toLowerCase()
    : "";
  const expectedMimeType = MIME_BY_EXTENSION[extension];

  if (!expectedMimeType || mimeType !== expectedMimeType) {
    return { ok: false, status: 415, reason: "unsupported_format" };
  }

  const signatureMatches = expectedMimeType === "application/pdf"
    ? hasPdfSignature(bytes)
    : hasJpegSignature(bytes);

  if (!signatureMatches) {
    return { ok: false, status: 415, reason: "signature_mismatch" };
  }

  return {
    ok: true,
    filename: normalizedFilename,
    extension,
    mimeType: expectedMimeType,
    sizeBytes: bytes.length,
  };
}
