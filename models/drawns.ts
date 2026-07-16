import mongoose, { Schema, model } from "mongoose";

export interface drawnDocument {
  _id: string;
  diameter: 4 | 4.2 | 4.4 | 4.6 | 4.7 | 5 | 5.5 | 6 | 8 | 10 | 12;
  ribbed: boolean;
  price: number;
  stockKg?: number | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const drawnSchema = new Schema<drawnDocument>(
  {
    diameter: {
      type: Number,
      required: [true, "diameter is required"],
    },
    ribbed: {
      type: Boolean,
      required: [true, "ribbed is required"],
    },
    price: {
      type: Number,
      required: [true, "price is required"],
    },
    stockKg: { type: Number, default: null, min: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

const drawn =
  mongoose.models?.drawn || model<drawnDocument>("drawn", drawnSchema);
export default drawn;
