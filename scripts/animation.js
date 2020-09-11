
/*

  -----------------------------------------------------------------

  ASCII ART

  -----------------------------------------------------------------

*/
//TODO find differences between some
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


var artno = 0; // ascii art counter
var directartno = 0; // actual art index
var maxart = 31; // maximum ascii art count

var asciiloops=["AAABAAACAAADAAAEAAABAAADAAACAAAE" ,  // bladder < urge
    "AFABAAACAAADAGAEAAABAGADAAACAFAE" ,  // bladder < need
    "AFGBAIACAAADFGAEAHABAGFDAAACAFGE" ,  // bladder < emer
    "AFGBJIACAKADFGAEAHABJGFDAKACLFGE" ,  // bladder < lose
    "ALJKFGAJKJKLHIFGHIHIKJLJAKJLJGIL"];  // bladder >= lose


var peeingloop="MNOPMNOPMNOPMNOPMNOPMNOPMNOPMNOP";

var alphadecode="ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// Animate loop
// A self calling function ( only call it to start ) that controlls the
// ASCII art animations depending on bladder state.
//
function anim8() {
    let pixfname;
    {
        if (nowpeeing) {
            directartno = alphadecode.indexOf(peeingloop.charAt(artno));
            pixfname = "pixpee";
        } else if (bladder < bladurge) {
            directartno = alphadecode.indexOf(asciiloops[0].charAt(artno));
            pixfname = "pixnorm";
        } else if (bladder < bladneed) {
            directartno = alphadecode.indexOf(asciiloops[1].charAt(artno));
            pixfname = "pixneed";
        } else if (bladder < blademer) {
            directartno = alphadecode.indexOf(asciiloops[2].charAt(artno));
            pixfname = "pixurge";
        } else if (bladder < bladlose) {
            directartno = alphadecode.indexOf(asciiloops[3].charAt(artno));
            pixfname = "pixemer";
        } else {
            directartno = alphadecode.indexOf(asciiloops[4].charAt(artno));
            pixfname = "pixlose";
        }
    }
    if (enableascii && withgirl && !enablehide) {
        document.getElementById('thepic').innerHTML = "<table style='text-align:right'><tr><td style='width:100px'><pre>" + asciiart[directartno] + "</pre></table>";
        artno++;
        if (artno > maxart) artno = 0;
    } else if (!enableimages || enablehide || !withgirl) {
        document.getElementById('thepic').innerHTML = "<table style='text-align:right'><tr><td style='width:100px'><pre>&nbsp;</pre></table>";
    } else {
        displaypix(pixfname);
    }

    if (!nowpeeing)
        setTimeout("anim8()", Math.floor(Math.random() * 750) + 250);
    else
        setTimeout("anim8()", 250);
}
