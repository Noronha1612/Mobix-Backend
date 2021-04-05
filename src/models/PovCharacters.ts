import { Schema, model } from 'mongoose';

export const povCharactersSchema = new Schema({
    url: String,
    name: String,
    gender: String,
    culture: String,
    born: String,
    died: String,
    father: String,
    mother: String,
    tvSeries: [String],
    playedBy: [String],
    povBooks: [String], // Only stores the name to avoid infinite loop
    titles: [String],
    aliases: [String]
});

export default model('povCharacters', povCharactersSchema);