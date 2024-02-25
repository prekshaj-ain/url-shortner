import mongoose, { Schema } from "mongoose";

// interface representing a document in MongoDB
interface IUrl {
  longURL: string;
  shortAlias: string;
  clicks?: number;
  clickTimestamps?: Date[];
  expirationDate?: Date;
}

const urlSchema = new Schema<IUrl>(
  {
    longURL: {
      type: String,
      required: true,
    },
    shortAlias: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    clickTimestamps: [
      {
        type: Date,
      },
    ],
    expirationDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

const URL = mongoose.model("URL", urlSchema);

export { URL, IUrl };
