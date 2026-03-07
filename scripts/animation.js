
/*

  -----------------------------------------------------------------

  ASCII ART

  -----------------------------------------------------------------

*/
//TODO potentially find a better way to deal with this
const asciiart = ["<br>    )))  <br>    . .  <br>     -   <br>   / | \\ <br>   \\   / <br>     |   <br>    / \\  <br>    | |  <br>    | |  <br>    d b  <br>",
    "<br>    )))  <br>    . ,  <br>     -   <br>   / | \\ <br>   \\   / <br>     |   <br>    / \\  <br>    | |  <br>    | |  <br>    d b  <br>",
    "<br>    )))  <br>    . .  <br>     =   <br>   / | \\ <br>   \\   / <br>     |   <br>    / \\  <br>    | |  <br>    | |  <br>    d b  <br>",
    "<br>    )))  <br>    . .  <br>     -   <br>   / | \\ <br>   |   / <br>     |   <br>    / \\  <br>    | |  <br>    | |  <br>    d b  <br>",
    "<br>    )))  <br>    . .  <br>     -   <br>   / | \\ <br>   \\   / <br>     |   <br>    / \\  <br>    | |  <br>    | |  <br>    d d  <br>",
    "<br>    )))  <br>    . .  <br>     p   <br>   / | \\ <br>   |   / <br>     |   <br>    / \\  <br>    | <  <br>    |  d <br>d    <br>",
    "<br>    )))  <br>    o o  <br>     -   <br>   / | \\ <br>   \\   | <br>     |   <br>    / \\  <br>    > |  <br>   b  |  <br>      d  <br>",
    "<br>    )))  <br>    , ,  <br>     o   <br>   / | | <br>   \\  /  <br>     m   <br>    / \\  <br>    | |  <br>    | |  <br>   d  b  <br>",
    "<br>    )))  <br>    > <  <br>     o   <br>   | | \\ <br>   \\   / <br>     m   <br>    / \\  <br>    | |  <br>    | |  <br>   d  b  <br>",
    "<br>    )))  <br>    - -  <br>     o   <br>   \\ | / <br>    \\ /  <br>     X   <br>    / \\  <br>    \\ /  <br>    / \\  <br>   d   b <br>",
    "<br><br>    )))  <br>    n n  <br>     o   <br>   | | \\ <br>    \\   / <br>     m   <br>    / \\  <br>   <> <> <br>   d   b <br>",
    "<br><br>    )))  <br>    - -  <br>     o   <br>   \\ | / <br>    \\ /  <br>     X   <br>    / \\  <br>   <> <> <br>   d   b <br>",
    "<br><br>    )))  <br>    - -  <br>     o   <br>   | | | <br>   \\   / <br>     X   <br>    /.\\  <br>   <>|<> <br>   d . b <br>",
    "<br><br>    )))  <br>    - -  <br>     o   <br>   | | | <br>   \\   / <br>     X   <br>    / \\  <br>   <>.<> <br>   d | b <br>",
    "<br><br>    )))  <br>    - -  <br>     o   <br>   | | | <br>   \\   / <br>     X   <br>    /|\\  <br>   <> <> <br>   d . b <br>",
    "<br><br>    )))  <br>    - -  <br>     o   <br>   | | | <br>   \\   / <br>     X   <br>    /|\\  <br>   <>|<> <br>   d o b <br>"];


let artno = 0; // ascii art counter
let directartno = 0; // actual art index
const maxart = 31; // maximum ascii art count

const asciiloops = ["AAABAAACAAADAAAEAAABAAADAAACAAAE",  // bladder < urge
    "AFABAAACAAADAGAEAAABAGADAAACAFAE",  // bladder < need
    "AFGBAIACAAADFGAEAHABAGFDAAACAFGE",  // bladder < emer
    "AFGBJIACAKADFGAEAHABJGFDAKACLFGE",  // bladder < lose
    "ALJKFGAJKJKLHIFGHIHIKJLJAKJLJGIL"];  // bladder >= lose


const peeingloop = "MNOPMNOPMNOPMNOPMNOPMNOPMNOPMNOP";

const alphadecode = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// Animate loop
// A self calling function ( only call it to start ) that controlls the
// ASCII art animations depending on bladder state.
//
function anim8() {
    let pixfname;

    // Decide which frame to show and which sprite name to use, based on state
    const chooseFrame = () => {
        if (nowpeeing) {
            pixfname = "pixpee";
            return alphadecode.indexOf(peeingloop.charAt(artno));
        }

        const states = [
            { threshold: bladurge, loopIdx: 0, pix: "pixnorm" },
            { threshold: bladneed, loopIdx: 1, pix: "pixurge" },
            { threshold: blademer, loopIdx: 2, pix: "pixneed" },
            { threshold: bladlose, loopIdx: 3, pix: "pixemer" }
        ];

        for (const s of states) {
            if (bladder < s.threshold) {
                pixfname = s.pix;
                return alphadecode.indexOf(asciiloops[s.loopIdx].charAt(artno));
            }
        }

        // Fallback: bladder >= bladlose
        pixfname = "pixlose";
        return alphadecode.indexOf(asciiloops[4].charAt(artno));
    };

    directartno = chooseFrame();

    const picEl = document.getElementById('thepic');
    if (enableascii) {
        picEl.innerHTML = "<table style='text-align:right'><tr><td style='width:100px'><pre>" + asciiart[directartno] + "</pre></table>";
        artno = (artno + 1) % (maxart + 1);
    } else if (!enableimages) {
        picEl.innerHTML = "<table style='text-align:right'><tr><td style='width:100px'><pre>&nbsp;</pre></table>";
    } else {
        displaypix(pixfname);
    }

    const delay = nowpeeing ? 250 : randomInt(750) + 250;
    setTimeout(anim8, delay);
}