import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import multer from 'multer';
import { translateFile } from './translateService.mjs';

const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(express.static('public'));

app.post('/translate', upload.single('file'), async (req, res) => {
  if (!req.file || !req.file.buffer) {
    return res.status(400).send('Nenhum arquivo foi enviado.');
  }

  const key = process.env.GOOGLE_TRANSLATE_API_KEY;

  const fileContent = await translateFile(key, req.file.buffer.toString());

  console.log('Finished translating');
  res.send(fileContent);
});

export default app;
