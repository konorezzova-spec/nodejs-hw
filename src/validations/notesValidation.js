import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';
import { TAGS } from '../constants/tags.js';

const tags = String(TAGS.map((value) => `'${value}'`).join(', '));

export const getAllNotesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1),
    perPage: Joi.number().integer().min(5).max(20),
    tag: Joi.string().valid(
      'Work',
      'Personal',
      'Meeting',
      'Shopping',
      'Ideas',
      'Travel',
      'Finance',
      'Health',
      'Important',
      'Todo',
    ),
    search: Joi.string().trim().allow(''),

    // sortBy: Joi.string().valid('_id', 'name', 'age', 'avgMark'),
    // sortOrder: Joi.string().valid('asc', 'desc'),
  }),
};

// Кастомний валідатор для ObjectId
const objectIdValidator = (value, helpers) => {
  return !isValidObjectId(value) ? helpers.message('Invalid id format') : value;
};

// Схема для перевірки параметра note
export const noteIdSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required(),
  }),
};

export const createNoteSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).max(30).required().messages({
      'string.base': 'Title must be a string',
      'string.min': 'Title should have at least {#limit} characters',
      'string.max': 'Title should have at most {#limit} characters',
      'any.required': 'Title is required',
    }),
    content: Joi.string().min(5).max(65).messages({
      'string.base': 'Content must be a string',
      'string.min': 'Content must be at least {#limit} characters',
      'string.max': 'Content must be at most {#limit} characters',
    }),
    tag: Joi.string()
      .valid(
        'Work',
        'Personal',
        'Meeting',
        'Shopping',
        'Ideas',
        'Travel',
        'Finance',
        'Health',
        'Important',
        'Todo',
      )
      .messages({
        'any.only': `Tag must be one of: ${tags}`,
      }),
  }),
};
export const updateNoteSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required(),
  }),
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1),
    content: Joi.string().allow(''),
    tag: Joi.string().valid(
      'Work',
      'Personal',
      'Meeting',
      'Shopping',
      'Ideas',
      'Travel',
      'Finance',
      'Health',
      'Important',
      'Todo',
    ),
  }).min(1), // важливо: не дозволяємо порожнє тіло
};
