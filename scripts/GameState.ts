class GameState {
    LocStack: string[] = [];
    Player: Person = new Person(yourbladurge);
    Date: Person = new Person(bladurge);
}

class Person{
    private _bladderUrge: number;

    /**
     * Level where the person starts to feel the first urge to pee.
     */
    get bladderUrge(): number {
        return this._bladderUrge;
    }

    /**
     * Level where the person constantly needs to go.
     */
    get bladderNeed(): number {
        return this._bladderUrge * 2;
    }

    /**
     * Level where the person becomes an emergency.
     */
    get bladderEmer(): number {
        return this._bladderUrge * 3;
    }

    /**
     * Level where the person loses control.
     */
    get bladderLose(): number {
        return this._bladderUrge * 3 + 150;
    }

    /**
     * Level where the person spurts as they cum.
     */
    get bladderCumLose(): number {
        return this._bladderUrge * 4;
    }

    /**
     * Level where the person can't hold it during sex.
     */
    get bladderSexLose(): number {
        return this._bladderUrge * 5;
    }

    readonly MinUrge: number;

    constructor(bladUrge: number) {
        this._bladderUrge = bladUrge;
        this.MinUrge = bladUrge * minperc / 100
    }
}