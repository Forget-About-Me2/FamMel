import {BaseGirl} from "./baseGirl";
import {BladderState} from "../gameState/bladderState";
import { ImageType } from "./imageType";

export class ImageSettings {
    Urls: Map<BaseGirl, Map<BladderState, string>> = new Map<BaseGirl, Map<BladderState, string>>();
    ImageType: ImageType = ImageType.Ascii
}