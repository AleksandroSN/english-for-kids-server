require('dotenv').config();
import path from 'path';
import { Request, Response, Application } from 'express';
import { categoryModel } from './models/category';
import { PaginationAndLimit } from './utils/pagination-and-limit';
import fileUpload from 'express-fileupload';
const uri = `mongodb+srv://${process.env.DB_LOG}:${process.env.DB_PASS}@clusterrss.azk0u.mongodb.net/EFKDatabase?retryWrites=true&w=majority`;
const mongoose = require('mongoose');
const cors = require('cors');
const express = require('express');
const app: Application = express();
const jsonParser = express.json();
const PORT = process.env.PORT || 3001;
const staticImages = path.resolve(__dirname, '../public/img');
const staticAudios = path.resolve(__dirname, '../public/audio');
const audioExt = ['wav', 'mp3'];

app.use(
  cors({
    origin: '*',
  })
);
app.use(fileUpload());
app.use(jsonParser);
app.use('/', express.static(staticImages));
app.use('/', express.static(staticAudios));

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Mongo is OPEN');
  });

app.get('/category', async (req: Request, res: Response) => {
  const { page, limit } = req.query;
  const categories = await categoryModel.find({});

  if (!page || !limit) {
    res.send(categories);
  } else {
    const result = PaginationAndLimit(page as string, limit as string, categories);
    res.send(result);
  }
});

app.get('/category/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const category = await categoryModel.findOne({ uniqueKey: id });
  res.send(category);
});

app.post('/category', jsonParser, async (req: Request, res: Response) => {
  const { uniqueKey } = req.body;
  const newCategory = await new categoryModel(req.body);
  await newCategory.save();
  const newItem = await categoryModel.find({ uniqueKey: uniqueKey });
  if (newItem) {
    res.status(200).send({ message: 'Category create', code: 200, category: newItem });
  } else {
    res.status(500).send({ message: 'Not valid Model', code: 500 });
  }
});

app.put('/category/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  await categoryModel.updateOne({ uniqueKey: id }, req.body);
  const updatedItem = await categoryModel.find({ uniqueKey: id });
  res.send(updatedItem);
});

app.delete('/category/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  await categoryModel.deleteOne({ uniqueKey: id });
  const modifyData = await categoryModel.find({});
  res.send(modifyData);
});

app.post('/upload', (req: Request, res: Response) => {
  console.log(req.files);
  const file = req!.files!.file as fileUpload.UploadedFile;
  const filename = file.name;
  const fileExt = filename.substr(filename.lastIndexOf('.') + 1);
  const path = audioExt.indexOf(fileExt) === -1 ? staticImages : staticAudios;
  file.mv(`${path}/${filename}`, (err) => {
    if (err) {
      res.status(500).send({ message: 'File upload failed', code: 500 });
    }
    res.status(200).send({ message: 'File Uploaded', code: 200 });
  });
});

app.listen(PORT, () => {
  console.log(`APP listen ${PORT}`);
});
