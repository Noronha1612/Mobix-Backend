import { Router } from 'express';
import BooksController from './controllers/BooksController';
import PovCharactersController from './controllers/PovCharactersController';
import ServiceController from './controllers/ServiceController';

const routes = Router();

const serviceController = new ServiceController();
const povCharactersController = new PovCharactersController();
const booksController = new BooksController();

routes.post('/sync', serviceController.syncDB);

routes.get('/povCharacters/all', povCharactersController.indexAll);
routes.get('/povCharacters/books', povCharactersController.indexCharBooks);
routes.get('/povCharacters', povCharactersController.indexByNames);

routes.get('/books/cover', booksController.indexCover);

export default routes;