import request from 'supertest';
import app from '../../../src/app';
import { IPovChar, StatusCodes } from '../../../src/types';
import { PovCharProperties } from '../../utils/PovChar';

describe('List all povChars tests', () => {

    it('Should get all pov Chars', async () => {
        const response = await request(app)
            .get('/povCharacters/all');

        expect(response.status).toBe(StatusCodes.OK);
        expect(response.body).not.toBeUndefined();
        expect(response.body.error).not.toBeTruthy();
        expect(response.body.data.length).toBeGreaterThan(0);
        
        response.body.data.forEach((povChar: IPovChar) => {
            PovCharProperties.forEach(prop => {
                expect(povChar).toHaveProperty(prop);
            });
        });
    });

})