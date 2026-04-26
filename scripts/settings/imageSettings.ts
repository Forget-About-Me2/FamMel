import {BaseCompanion} from "../models/baseCompanion";
import {BladderLevel} from "../gameState/bladderLevel";
import { ImageType } from "./imageType";

export class ImageSettings {
    Urls: Map<BaseCompanion, Map<BladderLevel, string>> = new Map<BaseCompanion, Map<BladderLevel, string>>();
    ImageType: ImageType = ImageType.Ascii
}