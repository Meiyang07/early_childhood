// src/services/cloudinery.service.ts
import cloudinary from "../config/cloudinery.js";
import type { UploadApiResponse } from "cloudinary";
import type { CloudinaryFolder } from "../constants/folders.js";

export interface UploadResult {
  url: string;
  publicId: string;
}

export class CloudinaryService {
  /**
   * Upload an in-memory file buffer to Cloudinary.
   * No disk writes — safe for ephemeral filesystems (Render, Heroku, Lambda).
   */
  static async uploadBuffer(
    buffer: Buffer,
    folder: CloudinaryFolder
  ): Promise<UploadResult> {
    if (!buffer || buffer.length === 0) {
      throw new Error("Cannot upload an empty buffer to Cloudinary");
    }
    if (!folder) {
      throw new Error("A Cloudinary folder is required");
    }

    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
          transformation: [
            { width: 800, height: 800, crop: "limit" },
            { quality: "auto:good" },
            { fetch_format: "auto" },
          ],
        },
        (error, result: UploadApiResponse | undefined) => {
          if (error || !result) {
            return reject(
              new Error(
                `Cloudinary upload failed: ${error?.message ?? "No result"}`
              )
            );
          }
          resolve({ url: result.secure_url, publicId: result.public_id });
        }
      );
      stream.end(buffer);
    });
  }

  /**
   * Delete an image by public_id.
   * Never throws — logs and continues so DB ops aren't blocked.
   */
  static async deleteImage(publicId: string): Promise<void> {
    if (!publicId) return;
    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: "image",
        invalidate: true,
      });
      if (result.result !== "ok" && result.result !== "not found") {
        throw new Error(`Unexpected result: ${result.result}`);
      }
    } catch (error) {
      console.error(
        `Cloudinary delete failed for ${publicId}:`,
        error instanceof Error ? error.message : error
      );
    }
  }

  /**
   * Extract public_id from a Cloudinary URL.
   * https://res.cloudinary.com/.../upload/v123/folder/abc.jpg  →  folder/abc
   */
  static extractPublicId(url: string): string | null {
    if (!url || !url.includes("cloudinary.com")) return null;
    try {
      const parts = url.split("/upload/");
      if (parts.length < 2) return null;

      const afterUpload = parts[1];
      if (!afterUpload) return null;

      return afterUpload.replace(/^v\d+\//, "").replace(/\.[^/.]+$/, "");
    } catch {
      return null;
    }
  }

  /**
   * Replace an existing image with a new buffer.
   * Order matters: upload first, then delete old — so a failed upload
   * leaves the old image intact.
   */
  static async updateImage(
    oldUrl: string | null | undefined,
    newBuffer: Buffer,
    folder: CloudinaryFolder
  ): Promise<UploadResult> {
    const uploaded = await this.uploadBuffer(newBuffer, folder);

    if (oldUrl) {
      const oldPublicId = this.extractPublicId(oldUrl);
      if (oldPublicId) await this.deleteImage(oldPublicId);
    }

    return uploaded;
  }
}