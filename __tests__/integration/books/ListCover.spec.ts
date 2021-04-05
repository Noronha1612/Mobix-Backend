import request from 'supertest';
import app from '../../../src/app';
import { StatusCodes } from '../../../src/types';

describe('List book(s) cover(s)', () => {

    it('Should get 1 book cover', async () => {
        const response = await request(app)
            .get('/books/cover?names=The%20Princess%20and%20the%20Queen,%20');

        expect(response.status).toBe(StatusCodes.OK);
        expect(response.body).not.toBeUndefined();
        expect(response.body.error).not.toBeTruthy();
        expect(response.body.data.length).toBe(1);

        response.body.data.forEach((base64image: string) => {
            expect(base64image).toMatch(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/);
        });
    });


    it('Should get all book covers by book name separeted by comma', async () => {
        const response = await request(app)
            .get('/books/cover?names=The%20Princess%20and%20the%20Queen,%20The%20Hedge%20Knight,%20The%20Rogue%20Prince');

        expect(response.status).toBe(StatusCodes.OK);
        expect(response.body).not.toBeUndefined();
        expect(response.body.error).not.toBeTruthy();
        expect(response.body.data.length).toBe(3);

        response.body.data.forEach((base64image: string) => {
            expect(base64image).toMatch(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/);
        });
    });


    it('Should not get a book cover if no name was provided', async () => {
        const response = await request(app)
            .get('/books/cover');

        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
        expect(response.body).not.toBeUndefined();
        expect(response.body.error).toBeTruthy();
        expect(response.body.data).toBeUndefined();
        expect(response.body.message).toBe('Property "names" missing on query params');
    });


    it('Should not get a book cover if none of the book names was found in DB', async () => {
        const response = await request(app)
            .get('/books/cover?names=wrongBook1,%20wrongBook2');

        expect(response.status).toBe(StatusCodes.NOT_FOUND);
        expect(response.body).not.toBeUndefined();
        expect(response.body.error).toBeTruthy();
        expect(response.body.data).toBeUndefined();
        expect(response.body.message).toBe('No book has been found');
    });

})