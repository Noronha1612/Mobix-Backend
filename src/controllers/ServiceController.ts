import axios from 'axios';
import { Request, Response } from 'express';
import Books from '../models/Books';
import PovCharacters from '../models/PovCharacters';

import { IBook, IPovChar, StatusCodes } from '../types';

export default class ServiceController {
    async syncDB(request: Request, response: Response) {

        // Util functions
        function alreadyExistInArray<T extends { name: string }>(array: T[], item: T) {
            let alreadyInserted = false;

            array.forEach(arrItem => {
                if ( arrItem.name == item.name ) alreadyInserted = true;
            });

            return alreadyInserted;
        }

        async function getBookPovChars(book: IBook): Promise<IPovChar[]>{
            
            const requestPromisses = book.povCharacters
                .map(povCharUrl => axios.get<IPovChar>(povCharUrl));
            
            const bookPovChars: IPovChar[] = (await Promise.all(requestPromisses))
                .map(response => response.data);

            return bookPovChars;
        }

        async function getPovCharBookNames(povChar: IPovChar): Promise<string[]>{
            const BookNamePromisses = povChar.povBooks
                .map(bookUrl => axios.get<IBook>(bookUrl));
            
            const povCharBookNames: string[] = (await Promise.all(BookNamePromisses))
                .map(response => response.data.name);

            return povCharBookNames;
        }

        // Start sync
        try { 
            const povCharsAlreadyInserted = await PovCharacters.find();
            const booksAlreadyInserted = await Books.find();
    
            const { data: allBooks } = await axios.get<IBook[]>('https://anapioficeandfire.com/api/books/');

            // Insert books and povChars inside the foreach
            allBooks.forEach(async book => {
                if ( !alreadyExistInArray(booksAlreadyInserted, book) ) {

                    const bookPovChars: IPovChar[] = await getBookPovChars(book); // All book povCharacters

                    const mappedBookPovChars = bookPovChars 
                        .map(async (povChar) => ({
                            url: povChar.url,
                            name: povChar.name,
                            gender: povChar.gender,
                            culture: povChar.culture,
                            born: povChar.born,
                            died: povChar.died,
                            father: povChar.father,
                            mother: povChar.mother,
                            tvSeries: povChar.tvSeries,
                            playedBy: povChar.playedBy,
                            povBooks: await getPovCharBookNames(povChar),
                            titles: povChar.titles,
                            aliases: povChar.aliases,
                        }));
                    
                    bookPovChars.forEach(povChar => {
                        if ( !alreadyExistInArray(povCharsAlreadyInserted, povChar) ){
                            povCharsAlreadyInserted.push(povChar);
                        }
                    });

                    await Books.create({
                        url: book.url,
                        name: book.name,
                        authors: book.authors,
                        isbn: book.isbn,
                        numberOfPages: book.numberOfPages,
                        publisher: book.publisher,
                        country: book.country,
                        mediaType: book.mediaType,
                        released: book.released,
                        povCharacters: await Promise.all(mappedBookPovChars)
                    });

                    const povCharAvailableToInsert = await Promise.all(mappedBookPovChars
                        .filter(async povChar => {
                            const resolvedChar = await Promise.resolve(povChar);

                            return !alreadyExistInArray(povCharsAlreadyInserted, resolvedChar);
                        }));

                    await PovCharacters.insertMany(povCharAvailableToInsert);
                    povCharAvailableToInsert.forEach(povChar => povCharsAlreadyInserted.push(povChar));
                }
            });
    
            return response.status(StatusCodes.OK).json({ message: 'Synchronized' });
        } catch (err) {
            console.log(err);
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
        }
    }
}