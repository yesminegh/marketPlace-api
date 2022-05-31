import { FileUpload } from 'graphql-upload';
import { GraphQLError } from 'graphql';
import fs, { ReadStream } from 'fs';
import { mkdir, stat } from 'fs/promises';
import path from 'path';
import { v4 } from 'uuid';
import { serverUrl } from 'config/vars';
import S3 from 'aws-sdk/clients/s3';
import { FileUpload as Uploader } from './FileUpload';

async function exists(path: string) {
  try {
    await stat(path);
    return true;
  } catch (e) {
    return false;
  }
}

export function saveUpload(name: string, data: ReadStream): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const isExist = await exists(path.join(__dirname, '../../uploads'));

      if (!isExist) {
        await mkdir(path.join(__dirname, '../../uploads'));
      }

      const fileName = v4() + name.slice(name.lastIndexOf('.'));

      const stream = fs.createWriteStream(path.join(__dirname, '../../uploads', fileName));
      data.pipe(stream);

      stream.on('finish', () => {
        resolve(`${serverUrl}/uploads/${fileName}`);
      });

      stream.on('error', (e) => {
        reject(e);
      });
    } catch (e) {
      reject(e);
    }
  });
}

export function streamBase64(stream: ReadStream): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';
    stream.read();

    stream.on('readable', () => {
      const read = stream.read();
      if (read) {
        data += read.toString('base64');
      }
    });
    stream.on('end', () => {
      resolve(data);
    });
    stream.on('error', (e) => {
      reject(e);
    });
  });
}

export async function validateUpload(file: FileUpload) {
  const data = await (file as FileUpload);
  if (!data.mimetype.startsWith('image/')) throw new GraphQLError('Type de fichier unauthorized');
  return data;
}

export const s3Instance = new S3({
  endpoint: process.env.MINIO_SERVER,
  accessKeyId: process.env.MINIO_ACCESS_KEY,
  secretAccessKey: process.env.MINIO_SECRET_KEY,
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
});

export const uploadInstance = new Uploader(
  s3Instance,
  process.env.BUCKET_NAME || 'test-packshop',
  process.env.S3_URL || 'http://149.202.94.4:9021',
);

export async function uploadFileS3(destination: string, file: FileUpload) {
  const { createReadStream, filename, mimetype } = await file;
  const stream = createReadStream();
  const { url } = await uploadInstance.uploadStream(stream, destination, filename, mimetype, 'public-read');
  return url;
}
