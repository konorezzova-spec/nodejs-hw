import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export const getAllNotes = async (req, res) => {
  // Отримуємо параметри пагінації і задаємо дефолтні значення, а також праментри фільтрації
  const {
    page = 1,
    perPage = 10,
    tag,
    search,
    // Отримуємо значення параметрів сортування
    // дефолтне сортування по _id
    // sortBy = '_id',
    // sortOrder = 'asc',
  } = req.query;

  const skip = (page - 1) * perPage;

  // Створюємо базовий запит до колекції
  const notesQuery = Note.find({ userId: req.user._id });

  // Пошук по частині імені
  if (search) {
    notesQuery.where({
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ],
    });
  }

  // Фільтр за тегом
  if (tag) {
    notesQuery.where('tag').equals(tag);
  }

  // Пагінація + сортування
  const [totalNotes, notes] = await Promise.all([
    notesQuery.clone().countDocuments(),
    notesQuery.skip(skip).limit(perPage),
    // Додаємо сортування в ланцюжок методів квері
    // .sort({ [sortBy]: sortOrder }),
  ]);
  // Обчислюємо загальну кількість «сторінок»
  const totalPages = Math.ceil(totalNotes / perPage);

  res.status(200).json({
    page,
    perPage,
    totalNotes,
    totalPages,
    notes,
  });
};

//одна нотатка за  ідентифікатором:
export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOne({ _id: noteId, userId: req.user._id });
  //базова обробка помилки замість res.status(404)
  if (!note) {
    throw createHttpError(404, 'Note not found');
  }
  //якщо все добре, повертаємо нотатку
  res.status(200).json(note);
};

//читає дані з req.body і створює документ через Note.create()
export const createNote = async (req, res) => {
  const note = await Note.create({ ...req.body, userId: req.user._id });
  res.status(201).json(note);
};

export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndDelete({
    _id: noteId,
    userId: req.user._id,
  });

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};

export const updateNote = async (req, res) => {
  const { noteId } = req.params;

  const note = await Note.findOneAndUpdate(
    { _id: noteId, userId: req.user._id }, // шукаємо по id
    req.body,
    { returnDocument: 'after' }, // повертаємо оновлений документ
  );

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};
