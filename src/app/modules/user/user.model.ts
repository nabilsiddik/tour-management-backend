import { model, Schema } from "mongoose";
import { IAuthProvider, IsActive, IUser, Role } from "./user.interface";


export const authProviderSchema = new Schema<IAuthProvider>({
    provider: {type: String, required: true},
    providerId: {type: String, required: true}
}, {
    _id: false,
    versionKey: false
})

const userSchema = new Schema<IUser>(
  {
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String},
    role: {
        type: String,
        enum: Object.values(Role),
        default: Role.USER
    },
    phone: {type: String},
    address: {type: String},
    isDeleted: {type: Boolean, default: false},
    isActive: {
        type: String,
        enum: Object.values(IsActive),
        default: IsActive.ACTIVE
    },
    isVerified: {type: Boolean, default: false},
    auths: [authProviderSchema],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const User = model<IUser>('user', userSchema)

export default User