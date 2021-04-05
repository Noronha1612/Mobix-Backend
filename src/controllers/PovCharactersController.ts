import { Request, Response } from 'express';
import PovCharacterManager from '../managers/PovCharacterManager';
import BookManager from '../managers/BookManager';

import { IPovChar, StatusCodes } from '../types';
import FormatName from '../utils/formatName';

const povCharacterManager = new PovCharacterManager();
const bookManager = new BookManager();

export default class PovCharactersController {
    async indexAll(request: Request, response: Response) {
        try {
            const allPovChars = await povCharacterManager.indexAll();

            return response.status(StatusCodes.OK).json({ error: false, data: allPovChars });
        } catch (err) {
            console.log(err);
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: true, message: 'Internal Server Error' });
        }
    }

    async indexByNames(request: Request, response: Response) {
        try {
            const { names: rawNames } = request.query as { names?: string };
            
            if ( !rawNames ) 
            return response.status(StatusCodes.BAD_REQUEST).json({ error: true, message: 'Missing "names" query param' });

            const names = rawNames
                .split(',')
                .filter(name => !!name)
                .map(rawName => FormatName(rawName.trim()));
            
            const povChars = (await Promise.all(names.map(name => povCharacterManager.indexByName(name))))
                .filter(char => !!char);

            if ( !povChars || povChars.length === 0 )
                return response.status(StatusCodes.NOT_FOUND).json({ error: true, message: `No Pov Character has been found` });

            return response.status(StatusCodes.OK).json({ error: false, data: povChars });
        } catch(err) {
            console.log(err);
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: true, message: 'Internal Server Error' });
        }
    }

    async indexCharBooks(request: Request, response: Response) {
        try {
            const { name: rawName } = request.query as { name?: string };
            
            if ( !rawName ) 
            return response.status(StatusCodes.BAD_REQUEST).json({ error: true, message: 'Missing "name" query param' });

            const povChar = await povCharacterManager.indexByName(FormatName(rawName)) as IPovChar | null;
            if ( !povChar )
                return response.status(StatusCodes.NOT_FOUND).json({ error: true, message: `Pov Character "${FormatName(rawName)}" not found` });

            const charBookNames = povChar.povBooks;
            const charBookInfos = await Promise.all(charBookNames.map(bookName => bookManager.indexByName(bookName)));

            return response.status(StatusCodes.OK).json({ error: false, data: charBookInfos.filter(info => !!info) });
        } catch(err) {
            console.log(err);
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: true, message: 'Internal Server Error' });
        }
    }
}