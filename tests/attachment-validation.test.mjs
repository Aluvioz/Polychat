import test from "node:test";
import assert from "node:assert/strict";
import {
  MAX_ATTACHMENT_BYTES,
  validateAttachment,
} from "../src/storage/attachment-validation.mjs";

const pdf = new TextEncoder().encode("%PDF-1.7\n1 0 obj\n<<>>\nendobj\n%%EOF\n");
const jpeg = new Uint8Array([
  0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00,
  0xff, 0xd9,
]);

test("accepts a PDF with matching extension, MIME and binary markers", () => {
  const result = validateAttachment({
    filename: "document.pdf",
    mimeType: "application/pdf",
    bytes: pdf,
  });
  assert.equal(result.ok, true);
  assert.equal(result.mimeType, "application/pdf");
});

test("accepts JPEG with .jpg extension", () => {
  assert.equal(validateAttachment({
    filename: "photo.jpg",
    mimeType: "image/jpeg",
    bytes: jpeg,
  }).ok, true);
});

test("accepts JPEG with .jpeg extension", () => {
  assert.equal(validateAttachment({
    filename: "photo.jpeg",
    mimeType: "image/jpeg",
    bytes: jpeg,
  }).ok, true);
});

test("rejects an extension and MIME mismatch", () => {
  const result = validateAttachment({
    filename: "photo.pdf",
    mimeType: "image/jpeg",
    bytes: jpeg,
  });
  assert.equal(result.ok, false);
  assert.equal(result.reason, "unsupported_format");
});

test("rejects PDF MIME when the bytes are not a PDF", () => {
  const result = validateAttachment({
    filename: "fake.pdf",
    mimeType: "application/pdf",
    bytes: jpeg,
  });
  assert.equal(result.ok, false);
  assert.equal(result.reason, "signature_mismatch");
});

test("rejects JPEG MIME when the bytes are not a JPEG", () => {
  const result = validateAttachment({
    filename: "fake.jpg",
    mimeType: "image/jpeg",
    bytes: pdf,
  });
  assert.equal(result.ok, false);
  assert.equal(result.reason, "signature_mismatch");
});

test("rejects MIME types outside the PDF/JPEG allowlist", () => {
  const result = validateAttachment({
    filename: "archive.zip",
    mimeType: "application/zip",
    bytes: new Uint8Array([0x50, 0x4b, 0x03, 0x04]),
  });
  assert.equal(result.ok, false);
  assert.equal(result.status, 415);
});

test("rejects empty files", () => {
  const result = validateAttachment({
    filename: "empty.pdf",
    mimeType: "application/pdf",
    bytes: new Uint8Array(),
  });
  assert.equal(result.ok, false);
  assert.equal(result.status, 400);
});

test("accepts a PDF at exactly the configured 10 MiB limit", () => {
  const bytes = new Uint8Array(MAX_ATTACHMENT_BYTES);
  bytes.set(pdf, 0);
  const result = validateAttachment({
    filename: "boundary.pdf",
    mimeType: "application/pdf",
    bytes,
  });
  assert.equal(result.ok, true);
  assert.equal(result.sizeBytes, MAX_ATTACHMENT_BYTES);
});

test("rejects files larger than the configured 10 MiB limit", () => {
  const result = validateAttachment({
    filename: "large.pdf",
    mimeType: "application/pdf",
    bytes: new Uint8Array(MAX_ATTACHMENT_BYTES + 1),
  });
  assert.equal(result.ok, false);
  assert.equal(result.status, 413);
});

test("stores only the basename and strips path separators/control characters", () => {
  const result = validateAttachment({
    filename: "../../folder\\report.pdf\u0000",
    mimeType: "application/pdf",
    bytes: pdf,
  });
  assert.equal(result.ok, true);
  assert.equal(result.filename, "report.pdf");
});
