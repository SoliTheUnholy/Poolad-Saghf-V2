import mongoose, { Schema, model, type InferSchemaType } from "mongoose";

export type CartStatus = "draft" | "pending" | "resolved" | "rejected";

const cartItemSchema = new Schema(
  {
    productId: { type: String, required: true },
    type: { type: Number, enum: [1, 2, 3], required: true },
    productInfo: { type: Schema.Types.Mixed, required: true },
    weight: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    discount: { type: Number, required: true, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
  },
  { _id: true },
);

const reviewSchema = new Schema(
  {
    status: { type: String, enum: ["pending", "resolved", "rejected"] },
    by: { type: String, required: true },
    at: { type: Date, default: Date.now },
  },
  { _id: false },
);

const cartSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    items: { type: [cartItemSchema], default: [] },
    status: {
      type: String,
      enum: ["draft", "pending", "resolved", "rejected"],
      default: "draft",
      required: true,
      index: true,
    },
    subtotal: { type: Number, default: 0, min: 0 },
    discountTotal: { type: Number, default: 0, min: 0 },
    total: { type: Number, default: 0, min: 0 },
    inventoryReserved: { type: Boolean, default: false },
    submittedAt: { type: Date, default: null },
    reviewedAt: { type: Date, default: null },
    reviewedBy: { type: String, default: null },
    reviewHistory: { type: [reviewSchema], default: [] },
  },
  { timestamps: true },
);

cartSchema.index(
  { userId: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: "draft" } },
);

export type CartDocument = InferSchemaType<typeof cartSchema> & {
  _id: mongoose.Types.ObjectId;
};

const Cart = mongoose.models?.cart || model("cart", cartSchema);
export default Cart;
