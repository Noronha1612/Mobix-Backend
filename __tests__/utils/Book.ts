import { IBook } from "../../src/types"

type BookProps = (keyof IBook)[]
export const BookProperties: BookProps = [
    "authors",
    "_id",
    "url",
    "name",
    "isbn",
    "numberOfPages",
    "publisher",
    "country",
    "mediaType",
    "released",
    "povCharacters"
]