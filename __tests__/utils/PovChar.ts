import { IPovChar } from "../../src/types"

type PovCharProps = (keyof IPovChar)[]
export const PovCharProperties: PovCharProps = [
    'tvSeries',
    'playedBy',
    'povBooks',
    'titles',
    'aliases',
    '_id',
    'url',
    'name',
    'gender',
    'culture',
    'born',
    'died',
    'father',
    'mother'
]