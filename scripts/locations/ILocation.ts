import {LocationCategory} from "../gameState/runtimeContext";

export interface ILocation {
    get Category() : LocationCategory
    Enter() : void;
    Main() : void;
    Leave() : void;
}