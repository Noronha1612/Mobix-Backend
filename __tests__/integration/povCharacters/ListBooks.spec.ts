import request from 'supertest';
import app from '../../../src/app';
import { IBook, StatusCodes } from '../../../src/types';
import { BookProperties } from '../../utils/Book';


describe('List PovChar Books', () => {
    

    it('Should get povChar\'s books by char name', async () => {
        const response = await request(app)
            .get('/povCharacters/books?name=jon%20snow');

        expect(response.status).toBe(StatusCodes.OK);
        expect(response.body).not.toBeUndefined();
        expect(response.body.error).not.toBeTruthy();
        expect(response.body.data.length).toBe(4);
        
        response.body.data.forEach((book: IBook) => {
            BookProperties.forEach(prop => {
                expect(book).toHaveProperty(prop);
            });
        });
    });


    it ('Should not get povChar\'s books if no names were provided', async () => {
        const response = await request(app)
            .get('/povCharacters/books');

        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
        expect(response.body).not.toBeUndefined();
        expect(response.body.error).toBeTruthy();
        expect(response.body.data).toBeUndefined();
        expect(response.body.message).toBe('Missing "name" query param');
    });


    it ('Should not get povChar\'s books if povChar has not been found', async () => {
        const response = await request(app)
            .get('/povCharacters/books?name=some%20wrong%20povChar');

        expect(response.status).toBe(StatusCodes.NOT_FOUND);
        expect(response.body).not.toBeUndefined();
        expect(response.body.error).toBeTruthy();
        expect(response.body.data).toBeUndefined();
        expect(response.body.message).toBe('Pov Character "Some Wrong PovChar" not found');
    });


})