declare interface String {
        formatVars(): string;

        format(args: string[]): string;
}


//Formats a given string with the given list of values.
//Overwrites the wildcards with the given values in the list.
//Wildcards are of the format {i} where i is the index of which the corresponding value is in the given list.
String.prototype.format = function () {
    let s = this,
        i = arguments[0].length;
    const args = arguments[0]
    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), args[i].toString());
    }
    return s;
};

//Format a given string adding the variables
String.prototype.formatVars = function () {
    const replacements = [
        [/girlname/gm, girlname],
        [/girltalk/gm, girltalk],
        [/girlgasp/gm, girlgasp],
        [/bladlose/gm, bladlose.toString()],
        [/pantyColor/gm, pantycolor],
        [/timeheld/gm, timeheld.toString()],
        [/bladderAm/gm, bladder.toString()],
        [/money/gm, money.toString()]
    ];

    return replacements.reduce((text, [pattern, replacement]) =>
            text.replaceAll(pattern, replacement),
        this
    );

}