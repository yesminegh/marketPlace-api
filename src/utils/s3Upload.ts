import S3 from 'aws-sdk/clients/s3';

import { log } from './log';
import { StreamUtils } from './streamUtils';

class UploadClient extends StreamUtils {
  s3Client: S3;
  BUCKET_NAME: string;
  S3_URL: string;
  constructor(client: S3, BUCKET_NAME: string, S3_URL: string) {
    super();
    this.s3Client = client;
    this.BUCKET_NAME = BUCKET_NAME;
    this.S3_URL = S3_URL;
  }
  uploadObject = async (params: S3.PutObjectRequest) => {
    return new Promise((resolve, reject) => {
      this.s3Client.putObject(params, (err, data) => {
        console.log({ err });
        if (err) {
          return reject(err);
        }

        log.info({ data });
        log.info('Successfully uploaded', params.Key);
        return resolve(params.Key);
      });
    });
  };

  removeObject = async (key: string) => {
    if (!key) {
      return log.error('No key !');
    }
    const params = {
      Bucket: this.BUCKET_NAME,
      Key: key,
    };

    return new Promise((resolve, reject) => {
      this.s3Client.deleteObject(params, (err, data) => {
        if (err) {
          log.error(err);
          reject(err);
        }
        log.info(data);
        log.info('removed', key);
        resolve(data);
      });
    });
  };

  async getSignedUrl(params: S3.GetObjectRequest) {
    return new Promise((resolve, reject) => {
      this.s3Client.getSignedUrl('getObject', params, (err, url) => {
        if (err) {
          console.error(err);
          return reject(err);
        }
        log.info('url', url);
        resolve(url);
      });
    });
  }

  addS3Url = (object: any, attachmentField: string) => {
    object[attachmentField] = `${
      object[attachmentField] && object[attachmentField]?.startsWith('http') ? '' : this.S3_URL
    }${object[attachmentField]}`;
    return object;
  };

  convertKeyToS3Url = (field: string) => {
    return `${field.startsWith('http') ? '' : this.S3_URL}/${field}`;
  };

  removeS3Url = (url: string): string => {
    return url.split(this.S3_URL)[1];
  };
}

export { S3, UploadClient };
