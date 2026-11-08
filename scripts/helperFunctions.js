Document.prototype.getRequiredElementById = function (id) {
    let element = this.getElementById(id);
    if (!element) {
        throw new Error(`Element with id '${id}' not found`);
    }
    return element;
}