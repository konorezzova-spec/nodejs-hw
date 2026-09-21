import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

// Список усіх нотатків
export const getAllNotes = async (req, res) => {
  const notes = await Note.find();
  res.status(200).json(notes);
};

//одна нотатка за  ідентифікатором:
export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findById(noteId);
  //базова обробка помилки замість res.status(404)
  if (!note) {
    throw createHttpError(404, 'Note not found');
  }
  //якщо все добре, повертаємо нотатку
  res.status(200).json(note);
};

//читає дані з req.body і створює документ через Note.create(...)
export const createNote = async (req, res) => {
  const note = await Note.create(req.body);
  res.status(201).json(note);
};

export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndDelete({
    _id: noteId,
  });

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};

export const updateNote = async (req, res) => {
  const { noteId } = req.params;

  const note = await Note.findOneAndUpdate(
    { _id: noteId }, // шукаємо по id
    req.body,
    { returnDocument: 'after' }, // повертаємо оновлений документ
  );

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};
