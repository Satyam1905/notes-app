import type { Response } from "express";
import Note from "../models/Note.js";

export const createNote = async (req: any, res: Response) => {
    const { content } = req.body;
    if(!content) {
        return res.status(400).json({ message: 'Content is required' });
    }

    const note = new Note({
        user: req.user._id,
        content,
    });

    const createdNote = await note.save();
    res.status(201).json(createdNote);
}

export const getNotes = async (req: any, res: Response) => {
    const notes = await Note.find({ user: req.user._id });
    res.status(200).json(notes);
}

export const deleteNote = async (req: any, res: Response) => {
    const note = await Note.findById(req.params.id);
    
    if(!note) {
        return res.status(404).json({ message: 'Note not found' });
    }

    if(note.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
    }

    await note.deleteOne();
    res.status(200).json({ message: 'Note deleted' });
};