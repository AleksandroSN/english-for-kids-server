import { Request, Response, Application } from 'express'
import { categoryModel,Category } from './models/category';
import path from 'path';
import { PaginationAndLimit } from './utils/pagination-and-limit';
const uri = "mongodb+srv://aleksrss:KLvBBmtDESL0zxl9@clusterrss.azk0u.mongodb.net/EFKDatabase?retryWrites=true&w=majority";
const mongoose = require("mongoose");

const PORT = 3001;
const express = require("express");
const app: Application = express();

const jsonParser = express.json();


mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Mongo is OPEN");  
})

app.get("/category", async (req:Request,res:Response) => {
  const {page,limit} = req.query;
  const categories = await categoryModel.find({}); 

  if (!page || !limit) {
    res.send(res.json(categories))
  } else {
    const result = PaginationAndLimit(page as string,limit as string,categories); 
  res.send(res.json(result))
  }
  
})

app.get("/category/:id", async (req:Request,res:Response) => {
  const {id} = req.params;
  const category = await categoryModel.findOne({uniqueKey : id});
  console.log(category);
  res.send(category);
})

app.post("/category", jsonParser ,async (req:Request,res:Response) => {
  const newCategory = await new categoryModel(req.body);
  newCategory.save();
  res.send("Check DB");
})

app.put("/category/:id", async (req:Request, res:Response) => {
  const {id} = req.params;
  await categoryModel.updateOne({uniqueKey: id}, {});
  res.send(`Check DB ${id} updated`)
})

app.delete("/category/:id" , async (req:Request, res:Response) => {
  const {id} = req.params;
  await categoryModel.deleteOne({uniqueKey: id});
  res.send(`item with ${id} deleted`);
})

app.get("/images/:name", (req:Request, res:Response) => {
  const options = {
    root: path.join(__dirname, '../public/img'),
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  }

  const filename = req.params.name;

  res.sendFile(filename, options , (err) => {
    if (err) {
      console.log(err);
      
    } else {
      console.log("Sent :" , filename);
      
    }
  })
})

app.get("/audio/:name", (req:Request, res:Response) => {
  const options = {
    root: path.join(__dirname, '../public/audio'),
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  }

  const filename = req.params.name;

  res.sendFile(filename, options , (err) => {
    if (err) {
      console.log(err);
      
    } else {
      console.log("Sent :" , filename);
      
    }
  })
})

app.listen(PORT, () => {
  console.log(`APP listen ${PORT}`);  
})















 
// // const testScheme = new Schema({beds: Number, listing_url: String}, {versionKey: false});
// // const User = mongoose.model("User", testScheme);

// // app.use(express.static(__dirname + "/public"));

// // Когда express ловит входящий запрос , то отрабатывается .use()
// app.use((req : Request, res : Response) => {
//   // req это входящий запрос
//   // res это исходящий запрос
//   console.log("REQUEST");
  
//   res.send("HELLO!!")
  
// })

// app.get("/", (req : Request, res : Response) => {
//   res.send("GET REQUEST");
// })

// // Как у реакта , передаем вложенный роутинг как :params , по которому можно будет что-то делать
// app.get("/:someparams", (req : Request, res : Response) => {
//   const {someparams} = req.params;
//   res.send(`Your params is ${someparams}`);
// })

// // у параметра request есть поле query , для запросов , тобишь query string
// app.get("/search", (req: Request, res: Response) => {
//   const {q} = req.query;
//   if (!q) {
//     res.send("And what you want here ?")
//   }
//   res.send(`Your search request is ${q}`)
// })

// app.post("/", (req: Request, res: Response) => {
//   res.send("POST REQUEST");
// })

// app.put("/", (req: Request, res:Response) => {
//   res.send("PUT REQUEST")
// })

// app.get("*", (req:Request, res:Response) => {
//   res.send("WOOOOUH STOP IT")
// })
