import { IBackpackItem } from "../../backPackItems";

export type PersonSaveObject = {
    BladderUrge: number;
    Bladder: number;
    TimeOfLastBreakingSeal: number;
    Tummy: number;
    MaxTummy: number;
    MaxAlcohol: number;
    ItemsDrankSinceLastPee: IBackpackItem[];
    AlcoholInTummy: number;
    NowPeeing: boolean;
    TummyAverage: number;
    lastPeeTime: number;
    lastAskedToHoldTime: number;
};
