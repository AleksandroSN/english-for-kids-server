import { model, Schema } from "mongoose";


interface Word {
  word: string;
  translation: string;
  imageSrc: string;
  audioSrc: string;
}

export interface Category {
  categoryName: string;
  image: string;
  uniqueKey: string;
  cards: Word[];
}

const categorySchema = new Schema<Category>({
  categoryName: {type: String, required: true },
  image: {type: String, required: true },
  uniqueKey: {type: String, required: true },
  cards: [{
    word: {type: String, required: true },
    translation: {type: String, required: true },
    imageSrc: {type: String, required: true },
    audioSrc: {type: String, required: true },
  }]
})

export const categoryModel = model<Category>("category", categorySchema);


