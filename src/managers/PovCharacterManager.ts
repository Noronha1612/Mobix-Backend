import PovCharacters from "../models/PovCharacters";
import { IPovChar } from "../types";

export default class PovCharacterManager {
    async indexAll(): Promise<IPovChar[]> {
        const allPovChars = await PovCharacters.find();

        return allPovChars;
    }

    async indexByName(name: string): Promise<IPovChar | null> {
        const povCharSelected = await PovCharacters.findOne({ name });

        return povCharSelected;
    }
}