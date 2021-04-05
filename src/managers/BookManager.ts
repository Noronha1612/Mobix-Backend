import Books from "../models/Books";
import { IBook } from "../types";

export default class PovCharacterManager {
    async indexByName(name: string): Promise<IBook | null> {
        const bookInfo: IBook | null = await Books.findOne({ name });

        return bookInfo;
    }
}