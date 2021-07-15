import { categoryModel } from '../models/category';
import {categories , cards} from "./seedHelpes";
const uri = "mongodb+srv://aleksrss:KLvBBmtDESL0zxl9@clusterrss.azk0u.mongodb.net/EFKDatabase?retryWrites=true&w=majority";
const mongoose = require("mongoose");

async function run(): Promise<void> {
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log("Mongo is OPEN");  
  })

  await categoryModel.deleteMany({});

  for (let i = 0 ; i < categories.length; i += 1) {
    const category = new categoryModel({
      categoryName: categories[i].name,
      image: categories[i].image,
      uniqueKey: categories[i].uniqueKey,
      cards: [...cards[i]]
    })
    await category.save();
  }
  mongoose.disconnect()
}

run().catch(err => console.log(err));