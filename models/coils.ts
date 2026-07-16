import mongoose, { Schema, model } from "mongoose";

export interface coilDocument {
  _id: string;
  diameter: 5.5 | 6.5 | 8 | 10 | 12;
  ribbed: boolean;
  type: "AII" | "AIII" | "3SP" | "RST" | "1008" | "1006";
  producer: "گلستان" | "یزد" | "کرمان" | "شیراز";
  price: number;
  stockKg?: number | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const coilSchema = new Schema<coilDocument>(
  {
    diameter: {
      type: Number,
      required: [true, "diameter is required"],
    },
    ribbed: {
      type: Boolean,
      required: [true, "ribbed is required"],
    },
    type: {
      type: String,
      required: [true, "type is required"],
    },
    producer: {
      type: String,
      required: [true, "producer is required"],
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

const coil = mongoose.models?.coil || model<coilDocument>("coil", coilSchema);
export default coil;
