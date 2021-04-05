import { Request, Response } from 'express';
import axios from 'axios';

import { StatusCodes } from '../types';

import BookManager from '../managers/BookManager';

const bookManager = new BookManager();

export default class BooksController {
    async indexCover(request: Request, response: Response) {
        try {
            const { names: rawNames } = request.query as { names: string | undefined };

            if ( !rawNames )
                return response.status(StatusCodes.BAD_REQUEST).json({ error: true, message: 'Property "names" missing on query params' });

            const names = rawNames
                .split(',')
                .filter(name => !!name)
                .map(name => name.trim());
        
            const books = (await Promise.all( names.map(name => bookManager.indexByName(name))))
                .filter(book => !!book);
    
            if ( !books || books.length === 0 )
                return response.status(StatusCodes.NOT_FOUND).json({ error: true, message: `No book has been found` });
        
    
            const allCoverBlobs = await Promise.all(books.map(book => {
                return axios.get(`http://covers.openlibrary.org/b/isbn/${book?.isbn}.jpg`);
            }));
    
            const allCoverBase64 = allCoverBlobs.map(blob => Buffer.from(blob.data, 'binary').toString('base64'));
            
            return response.status(StatusCodes.OK).json({ error: false, data: allCoverBase64 });
        } catch (err) {
            console.log(err);
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: true, message: 'Internal Server Error' });
        }
    }
}