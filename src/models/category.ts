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
  categoryName: { type: String, required: true },
  image: { type: String, required: true },
  uniqueKey: { type: String, required: true },
  cards: [
    {
      word: { type: String },
      translation: { type: String },
      imageSrc: { type: String },
      audioSrc: { type: String },
    },
  ],
});

export const categoryModel = model<Category>("category", categorySchema);
