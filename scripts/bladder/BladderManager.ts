import {RuntimeContext} from "../gameState/runtimeContext";
import {Person} from "../gameState/Person";
import {BladderLevel} from "../gameState/bladderLevel";

export class BladderManager {
    private readonly person : Person;
    constructor(runContext : RuntimeContext, person: Person) {
        this.person = person;
    }
}