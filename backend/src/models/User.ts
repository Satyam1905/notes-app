import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
    _id: string;
    name: string;
    email: string;
    dateOfBirth: Date;
    otp?: string;
    otpExpires?: Date;
    compareOtp(enteredOtp: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    dateOfBirth: { type: Date, required: true },
    otp: { type: String },
    otpExpires: { type: Date },
});

UserSchema.pre<IUser>('save', async function(next) {
    if(!this.isModified('otp') || !this.otp) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.otp = await bcrypt.hash(this.otp, salt);
    next();
});

UserSchema.methods.compareOtp = async function(enteredOtp: string): Promise<boolean> {
    if(!this.otp) {
        return false;
    }
    return await bcrypt.compare(enteredOtp, this.otp);
};

const User = mongoose.model<IUser>('User', UserSchema);
export default User;