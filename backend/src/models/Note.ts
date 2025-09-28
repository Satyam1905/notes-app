import mongoose, { Document, Schema } from "mongoose";

export interface INote extends Document {
    user: mongoose.Schema.Types.ObjectId;
    content: string;
}

const noteSchema: Schema = new Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
}, {
    timestamps: true,
});

const Note = mongoose.model<INote>('Note', noteSchema);
export default Note;