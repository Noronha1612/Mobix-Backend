import { Schema, model } from 'mongoose';
import { povCharactersSchema } from './PovCharacters';

const booksSchema = new Schema({
    url: String,
    name: String,
    isbn: String,
    authors: [String],
    numberOfPages: Number,
    publisher: String,
    country: String,
    mediaType: String,
    released: String,
    povCharacters: [povCharactersSchema]
});

export default model('books', booksSchema);