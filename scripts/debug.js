
// For debugging
function magic() {
    money = 150;
    attraction = 110;
    tummy = 700;
    bladder = bladneed;
    shyness = 20;
    seenmovie = 1; // Flag for having seen a movie already
    beenbar = 1;  //  Been to the bar already
    beenclub = 1; // Been to the club already
    beenmakeout = 1; // Seen a movie already

    roses = 1; // flowers object counter
    water = 1; // water bottle object counter
    vase = 1; // vase object counter
    ptowels = 1; // paper towel object counter
    panties = 1; // panties object counter
    champagne = 1; // champagne object counter
    shotglass = 1; // shot glass object
    earrings = 1; // earrings object counter
    wetpanties = 1; // wet panties object
    hercellphone = 1; // her cellphone object
    herkeys = 1; // her keys object
    beer = 10; // beer bottle object ( increased bladder cap on beer only )
    cocktail = 10; // cocktail object ( each increases maxtummy by 100 )
    soda = 10; // soda object ( This is a 500ml soda. )
    barkey = 1; // key to the bar
    clubkey = 1; // key to the club
    theaterkey = 1; // key to the theater
    owedfavor = 1; // she owes you a favor

    document.getElementById('stats-bar').innerHTML +=
        "<tr><td>&nbsp;" +
        "<td class='stats-cells-yellow'><small>BladUrge</small>" +
        "<td class='stats-cells-yellow'><small>BladNeed</small>" +
        "<td class='stats-cells-yellow'><small>BladEmer</small>" +
        "<td class='stats-cells-yellow'><small>BladLose</small>" +
        "<td class='stats-cells-yellow'><small>MaxTummy</small>" +
        "<td class='stats-cells-yellow'><small>RandCounter</small>" +
        "<tr><td>&nbsp;" +
        "<td id='bladu' class='stats-cells-white'>" + bladurge + "</td>" +
        "<td id='bladn' class='stats-cells-yellow'>" + bladneed + "</td>" +
        "<td id='blade' class='stats-cells-white'>" + blademer + "</td>" +
        "<td id='bladl' class='stats-cells-white'>" + bladlose + "</td>" +
        "<td id='maxt' class='stats-cells-yellow'>" + maxtummy + "</td>" +
        "<td id='randc' class='stats-cells-white'>" + randcounter + "</td>" +
        "</tr></table>";

}

function timewarp() {
    thetime = 60 * 7;
    hour = 2;
    meridian = "AM";
    s("The time mystertiously advances to 2AM.");
    c(locstack[0], "Continue...");
}

function ditchgirl() {
    withgirl = 0;
    s("Your companion mysteriously vanishes.");
    c(locstack[0], "Continue...");
}