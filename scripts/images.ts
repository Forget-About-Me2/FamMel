import { basegirl, imageprev, setImageprev } from './quotes';
import { enableimages } from './settings';
import { setText, imagedesc } from './quotes';
import { setjpgimgs } from './settings';
import { settings } from './shims';
import { gameState } from './gameState/gameState';

const DEFAULT_IMAGE_GIRLS = ["Jennifer", "Karen", "Laura", "Melissa"] as const;

function createDefaultImgsMap(): Record<string, Record<string, string>> {
    const defaults: Record<string, Record<string, string>> = {};
    for (const girl of DEFAULT_IMAGE_GIRLS) {
        defaults[girl] = {};
    }
    return defaults;
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Normalizes a legacy/caller-provided image map into the runtime shape.
 *
 * Rules:
 * - Keeps only object entries per girl.
 * - Keeps only string URL values per image key.
 * - Ensures default girls always exist: Jennifer, Karen, Laura, Melissa.
 * - Preserves extra custom girl keys if they are present.
 */
function normalizeImgsMap(value: Record<string, unknown>): Record<string, Record<string, string>> {
    const normalized: Record<string, Record<string, string>> = {};

    for (const [girlName, imageMap] of Object.entries(value)) {
        if (!isObjectRecord(imageMap)) {
            normalized[girlName] = {};
            continue;
        }

        const perGirl: Record<string, string> = {};
        for (const [imageKey, imageValue] of Object.entries(imageMap)) {
            if (typeof imageValue === "string") {
                perGirl[imageKey] = imageValue;
            }
        }
        normalized[girlName] = perGirl;
    }

    for (const girl of DEFAULT_IMAGE_GIRLS) {
        if (!isObjectRecord(normalized[girl])) {
            normalized[girl] = {};
        }
    }

    return normalized;
}

function canWriteCanonicalImgs(): boolean {
    return !!(gameState && gameState.isInitialized);
}

function getActiveImgs(): Record<string, Record<string, string>> {
    return canWriteCanonicalImgs() ? gameState.Imgs : imgs;
}

function persistImgsSnapshot(): void {
    if (typeof Storage === "undefined") {
        return;
    }
    localStorage.setItem("imgs", JSON.stringify(getActiveImgs()));
}

/**
 * Shows or clears the inline validation message in the image setup editor.
 *
 * This keeps validation feedback in-page instead of relying on alerts.
 */
function setEditPageError(message: string): void {
    const field = document.GetRequiredElementById<HTMLInputElement>('cusgirl');
    let errorEl = document.getElementById('pic-setup-error') as HTMLElement | null;
    if (!errorEl) {
        errorEl = document.createElement('div');
        errorEl.id = 'pic-setup-error';
        errorEl.style.color = '#b00020';
        errorEl.style.marginTop = '8px';
        field.insertAdjacentElement('afterend', errorEl);
    }
    errorEl.textContent = message;
}

export let imgs = {
    Jennifer:{},
    Karen:{},
    Laura:{},
    Melissa:{}
} as Record<string, Record<string, string>>;

export function setImgs(nextImgs: unknown): void {
    if (!isObjectRecord(nextImgs)) {
        return;
    }

    const normalized = normalizeImgsMap(nextImgs);

    if (canWriteCanonicalImgs()) {
        gameState.setImgs(normalized);
        imgs = gameState.Imgs;
        return;
    }

    imgs = normalized;
}

//sets imgs to the local stored version
export function importimgs(){
    if (canWriteCanonicalImgs()) {
        gameState.tryImportImgsFromStorage();
        imgs = gameState.Imgs;
        return;
    }

    const imgString = localStorage.getItem("imgs");
    if (!imgString) {
        imgs = createDefaultImgsMap();
        return;
    }

    try {
        const parsed = JSON.parse(imgString);
        if (!isObjectRecord(parsed)) {
            imgs = createDefaultImgsMap();
            return;
        }
        setImgs(parsed);
    } catch {
        imgs = createDefaultImgsMap();
    }
}

//resets imgs to the default version
function resetImg(){
    if (canWriteCanonicalImgs()) {
        gameState.resetImgsToDefault();
        imgs = gameState.Imgs;
    } else {
        imgs = createDefaultImgsMap();
    }
    localStorage.removeItem("imgs");
    createSelect();
    getUrl();
}

export let picset = 0;
export function setPicset(val: number) {
    const nextValue = Number(val);
    if (!Number.isFinite(nextValue)) {
        return;
    }

    if (gameState.isInitialized) {
        gameState.PicSet = nextValue;
        picset = gameState.PicSet;
        return;
    }

    picset = nextValue;
}

function getPicset(): number {
    return gameState.isInitialized ? gameState.PicSet : picset;
}
// displaypix will set the current picture to be displayed
//TODO figure out why need is called before urge
export function displaypix(picname: string) {
    const currentImgs = getActiveImgs();
    // Preserve legacy behavior: missing girl keys still throw instead of silently
    // rendering an undefined image source.
    const imgssrc = currentImgs[basegirl][picname];
    if (enableimages && imgssrc !== imageprev && !getPicset()) {
        document.GetRequiredElementById<HTMLElement>('thepic').innerHTML = "<img src=" + imgssrc + " alt=" + imagedesc + " class='pic'>";
    }
    setImageprev(imgssrc);
}

//TODO proper explanation on how setup works
//TODO show picture of first thing that's called
export function explainimgs() {
    setjpgimgs();
    setText(settings["picsetup"]);
    picsetup();
}

function picsetup(){
//Set up html
    if(localStorage.imgs) {
        importimgs();
    }
    createSelect();
    const girls = document.GetRequiredElementById<HTMLSelectElement>("girlname");
    girls.onchange = getUrl;
    const cusgirl = document.GetRequiredElementById<HTMLButtonElement>("addgirl");
    cusgirl.onclick = addGirl;
    const imgtypes = document.getElementsByName("imgtype");
    for(let i=0; i<imgtypes.length; i++ ){
        imgtypes.item(i).onclick = getUrl;
    }
    const update = document.GetRequiredElementById<HTMLButtonElement>('update');
    update.onclick = updateLink;
    const delgirl = document.GetRequiredElementById<HTMLButtonElement>('deletename');
    delgirl.onclick = delGirl;
    const picReset = document.GetRequiredElementById<HTMLButtonElement>('picreset');
    picReset.onclick = resetImg;
    setPicset(1);
    getUrl();
}

function createSelect(){
    let result = '';
    const currentImgs = getActiveImgs();
    for (let girlname in currentImgs){
        result += `<option value=${girlname} name="girl">${girlname}`;
    }
    document.GetRequiredElementById<HTMLElement>("girlname").innerHTML=result;
}

function getUrl(){
    const currentImgs = getActiveImgs();
    const e = document.GetRequiredElementById<HTMLSelectElement>("girlname");
    const name = e.options[e.selectedIndex].value;
    const imgtype = (document.querySelector<HTMLInputElement>("input[name=imgtype]:checked")?.value) ?? "";
    const urlbox = document.GetRequiredElementById<HTMLInputElement>("imgurl");
    if (currentImgs[name] && currentImgs[name].hasOwnProperty("pix" + imgtype)){
        let src = currentImgs[name]["pix" + imgtype];
        urlbox.value = src;
        document.GetRequiredElementById<HTMLElement>('thepic').innerHTML = "<img src=" + src + " alt=" + imagedesc + " class='pic'>";
    } else {
        urlbox.value = name + "-" + imgtype;
    }

}

function updateLink(){
    const e = document.GetRequiredElementById<HTMLSelectElement>("girlname");
    const name = e.options[e.selectedIndex].value;
    const imgtype = (document.querySelector<HTMLInputElement>("input[name=imgtype]:checked")?.value) ?? "";
    const url = document.GetRequiredElementById<HTMLInputElement>('imgurl').value;
    document.GetRequiredElementById<HTMLElement>("thepic").innerHTML = "<img src='" + url + "' alt='Picture of girl' class= 'pic'>";
    picStore(name, imgtype, url);
}

function addGirl(){
    const field = document.GetRequiredElementById<HTMLInputElement>('cusgirl');
    const placeholder = field.placeholder ? field.placeholder.trim() : "";
    const name = field.value.trim();
    field.value = "";
    // Reject empty/placeholder-like names and show an inline validation message.
    if (name === "" || (placeholder !== "" && name === placeholder)) {
        setEditPageError("Please enter a valid name before adding a girl.");
        return;
    }

    setEditPageError("");
    const nextImgs = { ...getActiveImgs(), [name]: {} };
    setImgs(nextImgs);
    persistImgsSnapshot();
    createSelect();
}

function delGirl(){
    const currentImgs = getActiveImgs();
    const e = document.GetRequiredElementById<HTMLSelectElement>("girlname");
    const name = e.options[e.selectedIndex].value;
    const nextImgs = { ...currentImgs };
    delete nextImgs[name];
    setImgs(nextImgs);
    persistImgsSnapshot();
    createSelect();
    getUrl();
}

function picStore(name: string, imgtype: string, url: string){
    const currentImgs = getActiveImgs();
    const nextImgs = { ...currentImgs };
    if(!nextImgs[name]){
        nextImgs[name]={};
    }
    //TODO potentially change naming of image calls
    nextImgs[name]["pix" + imgtype]= url;
    setImgs(nextImgs);
    persistImgsSnapshot();
}

export function exposeImagesOnWindow(): void {
    const w = window as any;
    w.displaypix = displaypix;
    w.explainimgs = explainimgs;
    w.importimgs = importimgs;
    Object.defineProperty(w, 'imgs', {
        get: () => getActiveImgs(),
        set: (v) => { setImgs(v); },
        configurable: true,
        enumerable: true,
    });
    Object.defineProperty(w, 'picset', {
        get: () => getPicset(),
        set: (v) => { setPicset(v); },
        configurable: true,
        enumerable: true,
    });
    w.__getLegacyImgsValue = () => imgs;
    w.__getLegacyPicsetValue = () => picset;
}