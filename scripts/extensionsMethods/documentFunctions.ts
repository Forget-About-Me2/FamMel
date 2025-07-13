function GetRequiredElementById<T extends HTMLElement>(id: string): T {
    let element = document.getElementById(id);
    if (!element) {
        throw new Error(`Element with id '${id}' not found`);
    }
    return element as T;
}