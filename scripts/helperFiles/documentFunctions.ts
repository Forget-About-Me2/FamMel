declare interface Document {
    GetRequiredElementById<T extends HTMLElement>(id: string): T;
}

Document.prototype.GetRequiredElementById = function <T extends HTMLElement>(id: string): T {
    let element = this.getElementById(id);
    if (!element) {
        throw new Error(`Element with id '${id}' not found`);
    }
    return element as T;
}