import { Model, Schema, model } from "mongoose";
import argon2 from "argon2";

// 1. Create an interface representing a document in MongoDB.
interface IUser {
  name: string;
  email: string;
  password: string;
}

interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<Boolean>;
}

interface UserModel extends Model<IUser, {}, IUserMethods> {}

// 2. Create a Schema corresponding to the document interface.
const schema = new Schema<IUser, UserModel, IUserMethods>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true, select: false },
  },
  {
    timestamps: true,
  }
);

schema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const hash = await argon2.hash(this.password);

  this.password = hash;

  return next();
});

schema.pre("findOneAndUpdate", async function (next) {
  try {
    if (this._update.password) {
      const hash = await argon2.hash(this._update.password);

      this._update.password = hash;
    }
    next();
  } catch (err: any) {
    return next(err);
  }
});

schema.method(
  "comparePassword",
  function comparePassword(candidatePassword: string): Promise<boolean> {
    return argon2.verify(this.password, candidatePassword);
  }
);

// 3. Create a Model.
const User = model<IUser, UserModel>("User", schema);

export { User, IUser };
