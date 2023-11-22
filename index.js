import express from "express";
import cors from "cors";
import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import db from "./database";

import "dotenv/config";

const app = express();

app.use(cors());

const BUCKET_NAME = "379060918904-zambryx-bucket"

const s3 = new S3Client({
  region: "us-east-1",
  AccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  SecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})


const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: BUCKET_NAME,
    key: (req, file, cb) => {
      cb(null, `imagenes/${file.originalname}`);
    },
    shouldTransform: (req, file, cb) => {
      cb(null, /^image/i.test(file.mimetype));
    },
    transforms: [{
      id: 'original',
      key: (req, file, cb) => {
        cb(null, file.originalname);
      },
      transform: (req, file, cb) => {
        // track progress of upload
        const progress = { loaded: 0, total: 0 };
        const params = { ...s3Params, Body: file.stream };
        const upload = s3.upload(params);

        upload.on('httpUploadProgress', (evt) => {
          progress.loaded = evt.loaded;
          progress.total = evt.total;
        });

        cb(null, upload, file.mimetype);
      }
    }]
  })
});



app.post("/upload", upload.single("imagen"), async (req, res) => {
  // Enviar respuesta
  res.status(200).json({ mensaje: "Imagen se subio correctamente" });
});

app.listen(3000, () => {
  console.log("Servidor iniciado en el puerto 3000");
});