import S3 from "aws-sdk/clients/s3";
import {S3Client} from "@aws-sdk/client-s3";
// import { fromEnv } from "aws-sdk/credential-providers";

const s3Config = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
    region: "us-east-2",
    signatureVersion: "v4",
  };
  
export const s3Client = new S3(s3Config);
