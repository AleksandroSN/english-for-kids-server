import "dotenv/config";
import mongoose from "mongoose";
import { CategoryModel } from "../models/category";
import { categories, cards } from "./seedHelpes";

const uri = `mongodb+srv://${process.env.DB_LOG}:${process.env.DB_PASS}@clusterrss.azk0u.mongodb.net/EFKDatabase?retryWrites=true&w=majority`;

async function run(): Promise<void> {
  await mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Mongo is OPEN");
    });

  await CategoryModel.deleteMany({});

  for (let i = 0; i < categories.length; i += 1) {
    const category = new CategoryModel({
      categoryName: categories[i].categoryName,
      imageSrc: categories[i].imageSrc,
      uniqueKey: categories[i].uniqueKey,
      cards: [...cards[i]],
    });
    // eslint-disable-next-line no-await-in-loop
    await category.save();
  }
  mongoose.disconnect();
}

run().catch((err) => console.log(err));
