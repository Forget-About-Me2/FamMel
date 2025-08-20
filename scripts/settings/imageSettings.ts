import {BaseCompanion} from "../models/baseCompanion";
import {BladderState} from "../gameState/bladderState";
import { ImageType } from "./imageType";

export class ImageSettings {
    Urls: Map<BaseCompanion, Map<BladderState, string>> = new Map<BaseCompanion, Map<BladderState, string>>();
    ImageType: ImageType = ImageType.Ascii
}