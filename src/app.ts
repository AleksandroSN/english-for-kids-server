import "dotenv/config";
import path from "path";
import express, { Request, Response, Application } from "express";
import fileUpload from "express-fileupload";
import mongoose from "mongoose";
import cors from "cors";
import { CategoryModel } from "./models/category";
import { PaginationAndLimit } from "./utils/pagination-and-limit";
import { HandlerUploadFiles } from "./utils/handlerUploadFiles";

const app: Application = express();
const uri = `mongodb+srv://${process.env.DB_LOG}:${process.env.DB_PASS}@clusterrss.azk0u.mongodb.net/EFKDatabase?retryWrites=true&w=majority`;
const jsonParser = express.json();
const PORT = process.env.PORT || 3001;
const staticImages = path.resolve(__dirname, "../public/img");
const staticAudios = path.resolve(__dirname, "../public/audio");

app.use(
  cors({
    origin: "*",
  })
);
app.use(fileUpload());
app.use(jsonParser);
app.use(express.urlencoded({ extended: true }));
app.use("/", express.static(staticImages));
app.use("/", express.static(staticAudios));

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongo is OPEN");
  });

app.get("/", (req: Request, res: Response) => {
  res.send("<h1>WORK!!</h1>");
});

app.get("/category", async (req: Request, res: Response) => {
  const { page, limit } = req.query;
  const categories = await CategoryModel.find({});

  if (!page || !limit) {
    res.send(categories);
  } else {
    const result = PaginationAndLimit(
      page as string,
      limit as string,
      categories
    );
    res.send(result);
  }
});

app.get("/category/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const category = await CategoryModel.findOne({ uniqueKey: id });
  res.send(category);
});

app.post("/category", jsonParser, async (req: Request, res: Response) => {
  const { uniqueKey } = req.body;
  const newCategory = await new CategoryModel(req.body);
  await newCategory.save();
  const newItem = await CategoryModel.find({ uniqueKey });
  if (newItem) {
    res
      .status(200)
      .send({ message: "Category create", code: 200, category: newItem });
  } else {
    res.status(500).send({ message: "Not valid Model", code: 500 });
  }
});

app.put("/category/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  await CategoryModel.updateOne({ uniqueKey: id }, req.body);
  const updatedItem = await CategoryModel.find({ uniqueKey: id });
  res.send(updatedItem);
});

app.delete("/category/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  await CategoryModel.deleteOne({ uniqueKey: id });
  const modifyData = await CategoryModel.find({});
  res.send(modifyData);
});

/* eslint-disable */
app.post("/upload", (req: Request, res: Response) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  if (req.files) {
    console.log(req.files);

    for (const key in req.files) {
      const fileName = req.files[key] as fileUpload.UploadedFile;
      HandlerUploadFiles(fileName);
    }
    res.status(200).send({ message: "File(s) Uploaded", code: 200 });
  }
});
/* eslint-enable */


app.listen(PORT, () => {
  console.log(`APP listen ${PORT}`);
});
