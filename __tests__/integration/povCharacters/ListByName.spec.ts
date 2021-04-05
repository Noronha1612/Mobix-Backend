import request from 'supertest';
import app from '../../../src/app';
import { IPovChar, StatusCodes } from '../../../src/types';
import { PovCharProperties } from '../../utils/PovChar';

describe('List povChars by names tests', () => {

    it('Should get povChars by names separated by comma', async () => {
        const response = await request(app)
            .get('/povCharacters/?names=jon%20snow,%20arya%20stark');

        expect(response.status).toBe(StatusCodes.OK);
        expect(response.body).not.toBeUndefined();
        expect(response.body.error).not.toBeTruthy();
        expect(response.body.data.length).toBe(2);
        
        response.body.data.forEach((povChar: IPovChar) => {
            PovCharProperties.forEach(prop => {
                expect(povChar).toHaveProperty(prop);
            });
        });
    });


    it ('Should get 1 povChar if only 1 name was provided', async () => {
        const response = await request(app)
            .get('/povCharacters/?names=%20jon%20snow%20,%20');

            expect(response.status).toBe(StatusCodes.OK);
            expect(response.body).not.toBeUndefined();
            expect(response.body.error).not.toBeTruthy();
            expect(response.body.data.length).toBe(1);
            
            response.body.data.forEach((povChar: IPovChar) => {
                PovCharProperties.forEach(prop => {
                    expect(povChar).toHaveProperty(prop);
                });
            });
    });


    it('Should get only povChar that has been found on DB', async () => {
        const response = await request(app)
            .get('/povCharacters/?names=jon%20snow,%20arya%20stark,%20some%20wrong%20povChar');

        expect(response.status).toBe(StatusCodes.OK);
        expect(response.body).not.toBeUndefined();
        expect(response.body.error).not.toBeTruthy();
        expect(response.body.data.length).toBe(2);
            
        response.body.data.forEach((povChar: IPovChar) => {
            PovCharProperties.forEach(prop => {
                expect(povChar).toHaveProperty(prop);
            });
        });
    });


    it ('Should not get povChars if none of the names has been found in DB', async () => {
        const response = await request(app)
            .get('/povCharacters/?names=jon%20snow%20wrong,%20arya%20stark%20wrong,%20some%20wrong%20povChar');

        expect(response.status).toBe(StatusCodes.NOT_FOUND);
        expect(response.body).not.toBeUndefined();
        expect(response.body.error).toBeTruthy();
        expect(response.body.data).toBeUndefined();
        expect(response.body.message).toBe('No Pov Character has been found');
    });


    it ('Should not get povChars if no names were provided', async () => {
        const response = await request(app)
            .get('/povCharacters/');

        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
        expect(response.body).not.toBeUndefined();
        expect(response.body.error).toBeTruthy();
        expect(response.body.data).toBeUndefined();
        expect(response.body.message).toBe('Missing "names" query param');
    });


    it ('Should not get povChars if names are empty', async () => {
        const response = await request(app)
            .get('/povCharacters/?names=');

        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
        expect(response.body).not.toBeUndefined();
        expect(response.body.error).toBeTruthy();
        expect(response.body.data).toBeUndefined();
        expect(response.body.message).toBe('Missing "names" query param');
    });

    
})