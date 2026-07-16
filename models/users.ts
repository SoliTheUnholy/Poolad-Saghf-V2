import mongoose, { Schema, model } from "mongoose";

export interface userDocument {
  _id: string;
  role: "admin" | "employee" | "user";
  name: string;
  number: string;
  password: string;
  code: string;
  address: string;
  zipCode: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<userDocument>(
  {
    number: {
      type: String,
      unique: true,
      required: [true, "Number is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "employee", "user"],
      default: "user",
      required: true,
    },
    name: {
      type: String,
      required: false,
    },
    code: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    zipCode: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.models?.user || model<userDocument>("user", userSchema);
export default User;
