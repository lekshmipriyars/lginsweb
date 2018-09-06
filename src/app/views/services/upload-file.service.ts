import { Injectable } from '@angular/core';

import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
@Injectable()
export class UploadFileService {

  FOLDER = '';
  Filename='';
  isUpload=false;
  uploadFileName='';
  constructor() { }
  uploadfile(file,url) {
    this.FOLDER= url;    ///insid+'/staff/'+departmentid+'/';
    const bucket = new S3((
      {
        accessKeyId: 'AKIAI5KZAGLNOWYJPOZA',
        secretAccessKey: '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',
        region: 'ap-southeast-1'
      }
    ));

    const params = {
      Bucket: 'insbetaresources',
      Key: this.FOLDER + file.name,
      Body: file
    };

    bucket.upload(params, function (err, data) {
      if (err) {
        console.log('There was an error uploading your file: ', err);
        this.isUpload=false;
        return false;
      }
      this.isUpload=true;
        console.log('Successfully uploaded file.', data);
      this.uploadFileName=data.location
        return true;
    });

      return
  }

}
