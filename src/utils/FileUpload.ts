import { Stream } from 'stream';
import { v4 as uuidv4 } from 'uuid';

import { S3, UploadClient } from './s3Upload';
import { log } from './log';
import AsyncFile from './AsyncFile';

type S3_ACL = 'public-read' | 'private' | 'public-read-write';

export class FileUpload extends UploadClient {
  constructor(client: S3, BUCKET_NAME: string, S3_URL: string) {
    super(client, BUCKET_NAME, S3_URL);
  }
  fileExtension = (filename: string) => {
    const r = filename.split('.');
    return r[r.length - 1];
  };

  // Upload stream coming for apollo upload for example
  uploadStream = async (
    file: Stream,
    destination: string,
    filename: string,
    filetype: string,
    acl?: S3_ACL,
    bucketName?: string,
  ): Promise<any> => {
    try {
      const buffer = await this.stream2buffer(file);
      const key = `${destination}${uuidv4()}.${filename.split('.')[1]}`;
      const params = {
        Bucket: bucketName || this.BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: filetype,
        ACL: acl || 'public-read',
      };
      const url = await this.uploadObject(params);
      // actual s3 upload
      const result = {
        url,
        key,
      };
      return result;
    } catch (error) {
      log.error(error);
      return error;
    }
  };

  async uploadFileFromDestination(filePath: string, cleanup = true, acl?: S3_ACL, bucketName?: string) {
    try {
      const buffer = await AsyncFile.ReadFile(filePath);
      const fileName = `${uuidv4()}.${this.fileExtension(filePath)}`;
      const Key = `${fileName}`;
      const params = {
        Bucket: bucketName || this.BUCKET_NAME,
        Key,
        Body: buffer,
        ACL: acl || 'public-read',
      };
      const result = {
        url: await this.uploadObject(params),
        /*bucket: process.env.BUCKET_NAME,
              key: key,*/
      };
      // cleanup files in server
      if (cleanup) {
        await AsyncFile.UnlinkFile(filePath);
      }
      return result;
    } catch (e) {
      log.error(e);
      return e;
    }
  }
}
