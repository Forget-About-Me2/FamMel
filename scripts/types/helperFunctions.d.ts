interface Document {
    /**
     * Get a element by it's id. throw if not found.
     * @param id
     * @constructor
     */
    getRequiredElementById(id: string): any;
}