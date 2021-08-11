//TODO make a more general function for handling curtext

const jsonlocs = ["options", "start", "yourhome", "herhome"]; //List of locations that have a corresponding json file
let jsonvars = {}; //Dictiornary list of variables that might need to be inserted in the string found in the json
let calledjsons = {}; //Dictionary list of all location that have already been queried, this saves them being queried multiple times meaning less requests for the server


//TODO maybe compress this in a list or something?
let flirtquotes; //This stores all possible flirts called from the JSON
let flirtresps; //This stores all possible responses called from the JSON
let feelUp; //This stores all quotes related to feeling her up
let kissing; //This stores all quotes related to kissing her
let ypeelines; //This stores all dialogues regarding to you going to the bathroom called from the JSON
let peelines; //This stores all dialogues regarding to her going to the bathroom called from the JSON
let needs; //This stores descriptions of her needs called from the JSON
let yneeds; //This stores descriptions of your needs called from the JSON
let drinklines; //This stores all lines regarding drinking from the JSON
let appearance; // This stores the appearance quotes from the JSON
let drive; //This stores all dialogues regarding driving around from the JSON
let general; //This stores all general quotes from JSON call
let darts; //This stores the json quotes for the darts game


let girlname = "Laura";
let customgirlname = "Amanda";
let basegirl = "Laura";
let girltalk = "<b>" + girlname + ":&nbsp;</b>";
let girlgasp = "<b>" + girlname + " gasps:&nbsp;</b>";

//
//  Feel up her thighs description when she has to go badly
//
// var feelthigh=["You feel her thigh muscles contracting and relaxing as she tries to hold back her pee.",
//     "You feel her tensing and relaxing her thighs as she fights the urge to urinate.",
//     "You feel goosebumps suddenly form on her sweaty skin as a spasm sends shivers up her leg.",
//     "You feel her exhausted sphincters spasming under your fingers.",
//     "You feel her thighs trembling with the effort to control her bladder.",
//     "Her hot, damp thighs feel slippery and they tremble with the effort of controlling her urge to pee."];

// var okayforyou=[
//     "Okay, since you're asking so nicely.  I'll hold it a little longer.",
//     "Well... okay. I'll control myself if it makes you happy.",
//     "Alright - I'll hold it in for you a little bit longer.",
//     "If you insist - I'll try to hold it a little more.",
//     "Okay.  I'll wait a bit more if that's what you want.",
//     "Fine.  I'll wait a just little longer if you'd like me to."
// ];

// her apologies for asking to go
var wanthold=["I know you asked me to wait, but...", "I know you told me not to go, but...", "I know you wanted me to hold it, but..." , "I know you asked me not to pee, but...", "I know you wanted me to control my bladder, but..." , "I know you didn't want me to go, but..."];

// Description of her holding her pee just for you
// var sheholds=[
//     "She needs to pee badly, but she's holding it for you.",
//     "Her bladder is bursting but she's controlling it because you asked her.",
//     "She's desperate to pee, but she's holding it just a little longer at your request.",
//     "Her bladder is terribly full, but she's holding it in to please you.",
//     "She's holding her pee in just for you, and she really needs to go.",
//     "She wants very much to pee, but she's holding it in like you asked."
// ];

//
//  Her expressions when peeing in a strange place
//  used by itscomingout()
//

const outpeelook=[
    "No!  Don't look!",
    "Ugh!  Don't watch me!",
    "Wait!  Don't look at me.",
    "Oh No!  Please don't look!",
    "Oh No! You can't look!",
    "Please don't stare!"
];
const outpeehide=[
    "Please help me hide!",
    "Please don't let anyone watch!",
    "Can you watch out for people coming?",
    "Can you help me hide?",
    "Please don't let anyone look!",
    "Don't let anybody see me!"
];
const outpeectrl=[
    "Ungh! I can't hold it anymore!",
    "Oh God!  I can't control it!",
    "Urgh!  I can't stop it.",
    "Oh! I can't wait any more!",
    "Fuck!",
    "Dammit!"
];

//
//  She curses
//
var curseword=["Dammit!", "Jesus!", "Shit!" , "Fuckit!", "Goddamn!", "Fuckin' A!", "Fuck!"];

//
//  Names of bar girls and escorts
//
var bargirlnames=["Tiffany", "Brittney", "Vanessa" , "Maya", "Angelina", "Samantha", "Carly"];

//
// Movie Plots
//
// moviedesc - 0 : Anticipate
//             1 : Strange
//             2 : Scary
//             3 : Sexy
//             4 : Romantic
//             5 : Sexy
//             6 : Romantic
//  This is "The Urge"
var moviedesc0=["The movie has just started.", "On the big screen, the heroine is being introduced - she apparently has some kind of super powers which are only activated by an intense need to pee.", "The movie has gotten to a scary part where the heroine is being stalked, but her bladder is far from full.", "The movie has reached a point where the heroine, after finally filling her bladder and dispensing with her attackers, is making out with her lover.", "The movie has reached a romantic interlude where the heroine decides to rescue her lover ... though she apparently has to pee bad since she never went to the restroom!", "In the movie, the lover has been rescued, and they are making out again.  The heroine is heroically resisting her incredible urge to pee.", "The movie is reaching a conclusion and the heroine is running hand in hand with her lover towards the bathroom as the credits roll."];

//  This is "Desperate Housewives, The Movie"
var moviedesc1=["The movie is starting.", "On the screen, the main characters are being introduced - three young newlyweds - a blonde, brunette and redhead - with controlling husbands who tell them they're not allowed to pee while the husband is away at work.", "In the movie, the redhead is waiting at home in the late afternoon, desperate to pee.  Tension rapidly builds as her husband is stuck in traffic on the way home.  She's on the verge of losing control.", "On screen, the redhead's husband finally shows up and she is overjoyed to see him.  They end up passionately making out at the front door.", "In the movie, the redhead is lovingly undressed and sat on the toilet by her husband, after which they share the romantic dinner she prepared while she was waiting for him to come home." , "In the movie, the blonde and brunette both meet up unexpectedly while out walking their dogs and trying to get their minds off their bursting bladders.  They make small talk, and because their minds are otherwise occupied, they don't seem to be able to tear themselves away from the conversaion.  Eventually, the secret comes out, and they are turned on so much they engage in some heavy petting on the excuse of helping to hold it in.", "In the movie, the two entangled and desperate women are found by their returning husbands, who rather than being angry, declare their gratitude for such devotion in the face of extreme bladder pressure.  The foursome goes out for a romantic candle-lit dinner after a discrete stop behind the bushes."];

//  This is "Control Yourself"
var moviedesc2=["The previews have just finished and the movie comes on." , "The movie's main character is introduced, a young and outgoing college girl whose one failing is her shyness when it comes to telling other people she needs to pee.", "Ominous music plays and tension rises as the film follows the slender youth into a 7-11 where she buys a huge soda <i>right before her two hour final exams</i>.", "On the big screen, the girl quickly downs the soda on the way to her test when she meets up with her boyfriend.  They adjourn behind a tree for a quickie and the camera is not afraid to follow them as they run their hands underneath each others clothes and build up a little sweat.", "The movie has reached a point where the girl must leave for her test, and her boyfriend comforts her fears of failure, promising to marry her if she passes.", "On the screen, after a very interesting stop motion sequence showing the test and the girl's increasingly desperate need to pee, the test is finally over and she speeds out of the room - of course running into her boyfriend again, who mistakes her desperate struggles for another type of desire.  They find a private restroom this time and clumsily rip each others clothes off.  The girl looks longingly at the toilet but says nothing." , "As the credits roll, the girl finally works up the courage to admit she has to pee like hell, and they kiss passionately as she finally is able to sit on the toilet and empty her bladder."];

//  This is 2 liters, 25 Hours
var moviedesc3=["You settle into your cushy seat with her by your side and the lights dim.", "The main detective is being introduced to dramatic music.  She's a young chinese woman with mad kung-fu skills, out to prove herself in the police force.  At the beginning of the movie, she's in kung-fu focus training, which somehow involves trying to ignore a very full bladder while practicing forms.", "On the big screen, our heroine is staking out a gangster.  More specifically, she's gotten herself stuck in a closet in his bedroom and he seems to have come home with company.", "In the movie, the head gangster has entered the bedroom and he's making out with a bevy of gangsterettes while our heroine watches from the closet.  She is getting turned on big time watching it all and she's got to pee in a bad way ... her hand strays to caress her pussy under her short skirt.", "After a harrowing escape, our heroine comes home and is greeted by her dog, to whom she confesses her doubts and fears while seated on the toilet.  The dog is suitably sympathetic and lays its head in her lap.", "The movie continues into a strange sex scene where the heroine is making out with the gangster boss and keeps excusing herself to go pee.  Not only is he reluctant to let her go pee, but when she is finally allowed to pee, she immediately feels an even stronger urge to go again when she returns.  Still, they work their way up to a sweaty climax - her acting is excellent, or maybe not even acting - the bulge of her bladder is clearly visible on screen." , "In the movie the heroine finally wakes up - it was all a dream.  She's in bed with her husband who hugs her tight and says she's been sleeping for nearly 25 hours.  He says he can't believe she didn't even get up to pee, and offers her a mason jar, which she fills, blissfully held in his arms."];

//
// You're driving around alone
//
var soloview=["You see nothing special.",
    "You see a couple walking down the sidewalk, their hands all over each other.",
    "You pass by a lonely gas station with a single car filling up.",
    "You drive by a club and hear loud music pounding out of the door.  There's a short line of very pretty young ladies waiting to get in.",
    "You see a car stopped alongside the road with the passenger door open.  It looks like someone in a short skirt is squatting behind the door.",
    "You notice a scantily clad young lady standing on the corner of the street.  She makes eye contact with you."];

//
// You look around the bar
//
// var barview=[
//     "You see nothing special.",
//     "You notice another couple making out in a dark corner.",
//     "You look down at the floor and see a condom wrapper among the littering of spent peanut shells.",
//     "You notice a phone number carved into the edge of the bar: 867-5309.",
//     "You see a gorgeous girl in a tight tube top with an empty stool next to her at the end of the bar.  There's a puddle of some liquid on the seat.",
//     "You look down at the floor and see a glint of metal."];

//
// You look around the club
//
var clubview=["You see nothing special.",
    "You see a couple making out in a dark corner.",
    "You notice a gorgeous girl in a short and tight black dress pressing at her crotch under the table as she appears to be in rapt conversation with her date.",
    "You see a couple dancing.  As she twirls, her short skirt flies up revealing a pair of skimpy, translucent panties.",
    "You see a waitress having an urgent conversation with the bartender.  She's squirming and pressing her crotch into a bar stool while pointing repeatedly in the direction of the restrooms.",
    "You look down at the floor and see a glint of metal."];

//
// You look around the make-out spot
//
var makeview=["You see nothing special.",
    "You see city lights below and sparkling stars above.",
    "You see another car parked in the corner of the lot with its windows fogged up.",
    "You see a darker patch of ground a couple of spaces over, with what looks like a tiny rivulet draining into the gutter.",
    "You see a soaked pair of white cotton panties lying on the ground.",
    "You look down and see a glint of metal."];


//
// Cocktail Bartender Quotes ( she's cute, isn't she? )
//

var bargirlflirt=["Wow, that outfit looks so good on you! Where'd you get it?",
    "Hey!  Haven't I seen you before somewhere?  Nope - I'd definitely remember that well.",
    "What a busy night!  When do you get off?",
    "I'm sorry to stare - it's just that you're the most stunningly beautiful woman I've seen tonight.",
    "Have you been working here long?  I think I'd remember a beautiful face like yours.",
    "Damn, you're good looking."];

var bargirlresp=["Thanks!  I made it ... do you think it's too sexy?",
    "I don't think we've met - my name's Cynthia.",
    "I'm working here until closing, but I might get off sooner with a little help.",
    "Gee - thanks!  Do you really mean it?  Look all you want!",
    "Well I just started last week ... am I doing okay?",
    "Well, you're not too bad looking yourself."];

var bargirlquotes=["It's pretty crowded tonight, isn't it?",
    "Do you come here often?",
    "Wow!  Have you seen the line for the restrooms tonight?",
    "Anything else I can do for you?",
    "Man it's hot in here, isn't it?",
    "Hey, handsome, did you come here alone?"];

var bargirldesc=["The girl tending the bar is really good-looking.",
    "You can't help but notice how good the bartender looks in her uniform.",
    "The bartender seems to be smiling at you, and she looks pretty hot.",
    "The gorgeous bartender keeps stealing glances at you - you wonder if she's trying to tell you something.",
    "The bartender leans over the bar giving you an eyefull down her shirt.",
    "The bartender bites her lip as she locks eyes with you."];

//
//  She's trying to hold it despite availability of restroom
//  ( used during Champagne pouring )
//
var wonderwhy=["I shouldn't be doing this!" , "This is <b>so</b> hard!" , "Why am I doing this???" , "This is crazy, but I love it!" , "I'm such a ditz!", "I must be nuts."];

var cantdo=["I can't even think straight!", "I can't even walk right!" , "I can't stop moving or..." , "I'm out of control!" , "I've got to concentrate on the task at hand." , "I'm trembling all over."];

//
//  Descriptions of her posing for you
//


var posenude=["shyly covers her breasts with one hand and her pussy with the other.  Her face is a bright red.", "turns her back to you and tries to hide her bare bottom with one hand while she looks back over her shoulder.  You see the curls of her pubic hair in the space between her legs.", "slowly turns toward you, her breasts pressed between her extended arms, and both hands firmly blocking your view of her crotch.", "shyly moves one of her hands to her hip and cups a breast with the other.  She holds one leg crossed just a little forward, squeezing the exposed slit of her pussy closed.", "turns slightly, spreads her legs and caresses her inner thigh with one hand while spreading the other across the opposite butt cheek.", "turns away and bends down to touch her toes, legs spread slightly.  Her glistening pussy and cute, tight anus are fully exposed to your camera."];

var poseemer=["<i>She seems to be having trouble keeping her legs still for any length of time, and she's breathing hard with the effort to control her bladder.</i>", "<i>She keeps unconsciously moving her hand closer to her pussy from behind and then catching herself and moving it back.  Her expression is strained as she tries to hold her pee and hold still at the same time.</i>", "<i>You can see sweat on her face as she tries to fight the burning pressure in her bladder and stay posed until you take a picture.</i>", "<i>She's trembling with the effort to control her bladder using just her sphincters while holding the pose at the same time.</i>", "<i>Her hips won't stop moving as she tries to manage her overwhelming urge to pee without breaking the pose.</i>", "<i>She's gasping for breath as she fights the spasms and her whole body shakes with the effort to hold both the pose and the contents of her overfull bladder.</i>"];

//
// Descriptions of her filling the champagne glasses in various situations.
//

var fillchamp=["She bends over to fill the glasses, jamming one hand into her crotch.", "She fills both glasses and you can see her hand shaking with the effort to control herself." , "She fills both glasses, the bottle rattling against their rims as she shudders in an effort of self control." , "She quickly sits on her heel and fills the glasses kneeling in front of you.", "She jerks her ass back and forth violently as she bends over to fill both glasses.", "She nearly drops the bottle and her whole body shudders violently as she fills both glasses."];

var fillchampbad=["She's gasping for breath as she fills both glasses, sloppily spilling most of it onto the table top." , "She bends over to fill both glasses and stumbles backwards, spilling champagne onto the floor.", "She kneels and presses her pussy into the corner of the coffee table as she fights for control while filling both glasses.", "She jams the champagne bottle into her crotch and holds very still for a few seconds before splashing the drink in the direction of the glasses, spilling most of it onto the floor." , "She sits down heavily on the coffee table as she fills the glasses, shuddering and spilling most of it onto the floor.", "She holds the bottle pressed to her crotch as she raises the glasses and tries to fill them, spilling most of it onto the floor."];

//
//  Interpreted descriptions of how she looks like she has to pee
//
// var interplose=[
//     "She looks like she's losing control.",
//     "She looks like she's going to blow any second.",
//     "She looks like she's seconds away from peeing herself.",
//     "She looks like she can't maintain bladder control any longer.",
//     "She looks like she's going to pee any second.",
//     "She looks like she can't hold it a second longer."
// ];
//
// var interpemer=[
//     "She looks like she's nearly wetting herself.",
//     "She looks like she's about to lose bladder control.",
//     "She looks super desperate to pee.",
//     "She looks like she can't stand to wait very much longer to pee.",
//     "She looks like she could lose control of her bladder any minute.",
//     "She looks absolutely desperate for the toilet."
// ];
//
// var interpneed=[
//     "She looks uncomfortable - like she has to pee badly.",
//     "She looks like she's trying to ignore a full bladder.",
//     "She's acting like her bladder is uncomfortably full.",
//     "She seems to be controlling her bladder.",
//     "She seems distracted by the pressure in her bladder.",
//     "She's looks like she might need to pee."
// ];


//
//  She's about to lose control in the car.
//
var carlosequotes=["I don't care where, but I need to get out of the car <b>NOW</b>!","I'm gonna wet my panties if you don't stop and let me out!","I can't wait anymore, just stop and let me out <b>NOW</b>!","I can't hold it anymore - just stop here or I'll wet in the car!","I <i>can't</i> wait any longer, you've gotta let stop and let me out!","I really really have to pee somewhere!  Anywhere!"];

var caremerquotes=["You've just <i>got</i> to find me somewhere to stop soon so I can use the restroom.","I <i>really</i> need to visit the little girls room - are you sure you don't see somewhere we can stop?","I've gotta stop by the next place you see that might have a toilet.","I need to take a leak before I have an accident in my panties - can you please stop the next place you see?","I'm getting <i>desperate</i> for a restroom - just stop at the next gas station or whatever you see.","I <b>have</b> to go to the bathroom - isn't there <i>anything</i> with a restroom on this street?"];

var carneedquotes=["I've got to go pretty bad, so if you know a place with a restroom, could we stop?","I need to visit the little girls room.  Do you think we'll get there soon?","I have to go pee soon.  Are we there yet?","I've gotta stop by the toilet, my bladder is bursting.  We're gonna be there soon, right?","I need to go powder my nose when we get where we're going.  It's not much longer, right?","I have to take a bio break when we get there.  It's not that far, right?"];

var carurgequotes=["I'm going to want to go and pee soon.","I think my bladder is getting full.","I might have to stop at the restoom before too long.","I guess I'll need to freshen up next.","I'd better go powder my nose soon.","I'd like to stop by the restroom in the next little bit."];

//
//  She's about to lose control and she's not in the car
//
var losequotes=["I need to find somewhere to pee <b>NOW</b>!","I'm gonna wet my panties if I don't get to a restroom!","I can't wait anymore, I need to pee <b>NOW</b>!","I can't hold it anymore - I must get to the restroom!","I <i>have</i> to get to the bathroom!","I really <i><b>really</b></i> have to pee somewhere!  <i>Anywhere!</i>"];

var emerquotes=["I've <i>got</i> to get to a bathroom soon.","I <i>really</i> need to visit the little girls room.","I've gotta get to a toilet or I'm going to wet myself.","I need to take a leak before I have an accident in my panties.","I'm getting <i>desperate</i> for a restroom.","I <b>have</b> to go to the bathroom.  <i>Now</i>."];

var needquotes=["I've gotta pee pretty badly.","I need to visit the little girls room.","I have to go pee now.","I've gotta stop by the toilet, my bladder is bursting.","I need to go powder my nose.","I have to take a bio break."];

var urgequotes=["I'm going to want to go and pee soon.","I think my bladder is getting full.","I might have to stop at the restoom before too long.","I guess I'll need to freshen up next.","I'd better go powder my nose soon.","I'd like to stop by the restroom in the next little bit."];


//
//  She's embarassed she couldn't hold it.
//
var embarquote=[
    "I'm so embarassed.  I just couldn't hold it in.",
    "I'm so sorry!  I just couldn't control it anymore.",
    "I'm so embarassed!  It just started to come out and I couldn't stop it.",
    "It's so embarassing.  I just couldn't control my bladder.",
    "I'm so sorry!  I couldn't hold it any longer.",
    "I'm so embarassed!  I couldn't control myself."];

//
// You lose control
//
var ywetquote=["Suddenly, you are overwhelmed by your bladder, you groan and then gasp!",
    "Suddenly, you are overwhelmed by your overfilled bladder, you freeze in place and you can feel your face turning red",
    "You feel your pee coming out, you gasp and grab your dick.",
    "You lose control of your muscles, you groan and double over.",
    "Suddenly. You lose control of your bladder, you gasp and you can feel your face turning red.",
    "Suddenly the control on your sphincter slips, you shudder and you can feel your face turning red."
];


//
//  You are her hero - now get out of the way before she wets herself
//

var sayhero=[
    "You are my <b>hero</b>!",
    "I thank you, my bladder thanks you, now get outta my way!",
    "Thank <b>god</b>, I was dying!",
    "You the <b>man<b>!",
    "You've saved my life tonight!",
    "Damn you're good!"];

//
// Walk descriptions
//
var walkdesc=["You walk hand in hand past dark houses.",
    "The sidewalk is a little bit cracked here.",
    "You pass a deserted bus stop.",
    "You walk past a vacant lot, overgrown with weeds.",
    "You walk past a small city park.",
    "You see a tall wooden fence, and a gate sitting slightly ajar."];

//
// Leaving
//
var outtahere= [
    "Let's hit the road!",
    "We're outta here!",
    "Let's get going!",
    "Let's get a move on!",
    "We're on our way!",
    "Let's make like a tree and get outta here!"
];

// Your fingers smell of her pee.
var smellpee=[
    "They smell of sex ... and her sweet urine.",
    "They smell musky, with the clean scent of fresh pee.",
    "They smell strongly of her urine.",
    "They are sticky with the scent of her sex, and her pee.",
    "They are coated with the scent of her pee.",
    "The smell reminds you of a toilet filled with golden urine, just before it's flushed."
];

String.prototype.format = String.prototype.f = function() {
    let s = this,
        i = arguments[0].length;
    const args = arguments[0]
    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), args[i]);
    }
    return s;
};

//Format a given string adding the variables
String.prototype.formatVars = function() {
    let s = this;
    s = s.replaceAll(new RegExp("girlname",'gm'), girlname);
    s = s.replaceAll(new RegExp("girltalk", 'gm'), girltalk);
    s = s.replaceAll(new RegExp("bladlose", 'gm'), bladlose);
    return s;
}

function formatString(expr, arguments){
    return expr.format(arguments);
}

//formats all Strings in exprList with the corresponding value in values
function formatAll(exprList, values){
    let result = [];
    for(let i=0;i<exprList.length; i++){
        result.push(formatString(exprList[i], [values[i].toString()]));
    }
    return result;
}

//Formats all Strings in exprList to add the variables
function formatAllVars(exprList){
    let result = [];
    exprList.forEach(str => result.push(str.formatVars()));
    return result;
}

//Formats all String in a list of list to add the variables
function formatAllVarsList(list){
    let result = [];
    list.forEach(exprList => result.push(formatAllVars(exprList)));
    return result;
}

function addGirlname(quotes){
    let result = [];
    quotes.forEach(item => result.push(item.format([girlname])));
    return result;
}

function addMoney(quotes){
    let result = [];
    quotes.forEach(item => result.push(item.format([money])));
    return result;
}

function addGirlTalk(quotes){
    let result = [];
    quotes.forEach(item => result.push(item.format([girltalk])));
    return result;
}

function addGirlGasp(quotes){
    let result = [];
    quotes.forEach(item => result.push(item.format([girlgasp])));
    return result;
}

function printIntro(curtext, index){
    locjson.intro[index].forEach(item => curtext.push(item));
    return curtext;
}

function printAlways(curtext) {
    locjson.always.forEach(item => curtext.push(item));
    return curtext;
}

function printDialogue(curtext, loc, index){
    locjson.dialogue[loc][index].forEach(item => curtext.push(item));
    return curtext;
}

//Only prints specified part of dialogue
function printSDialogue(curtext, loc, index, begin, end){
    for(let i = begin; i <= end; i++){
        curtext.push(locjson.dialogue[loc][index][i]);
    }
    return curtext;
}

function printFormatDialogue(curtext, loc, index, begin, end, values){
    for(let i = begin; i <= end; i++){
        const temp = locjson.dialogue[loc][index][i]
        curtext.push(formatString(temp, values));
    }
    return curtext;
}

function printList(curtext, list){
    list.forEach(item => curtext.push(item));
    return curtext;
}

function printListSelection(curtext, list, selection){
    selection.forEach(index => curtext.push(list[index]));
    return curtext;
}

//Of a given list of list print the list at the given index
function printLList(curtext, list, index){
    list[index].forEach(item => curtext.push(item));
    return curtext;
}

//Prints the given selection of choices for the current location
function printChoices(curtext, selection){
    selection.forEach(index => curtext = callChoice(locjson.choices[index], curtext));
    return curtext;
}

//Prints all choices
function printAllChoices(curtext){
    locjson.choices.forEach(item => curtext = callChoice(item, curtext) );
    return curtext;
}

//Prints the given selection of choices for the given choices list
function printChoicesList(curtext, selection, list){
    selection.forEach(index => curtext = callChoice(list[index], curtext));
    return curtext;
}

//Prints all the choices for the given choices list
function printAllChoicesList(curtext, list){
    list.forEach(item => curtext = callChoice(item, curtext))
    return curtext;
}

function callChoice(choice, curtext){
    if(choice[0] === "curloc") {
        return c([locstack[0], choice[1]], curtext);
    } else {
        return c(choice, curtext);
    }
}

// Cache a choice
// choice - array of length 2 with tag on index 0 and desc on index 1
//   tag - function to activate using choice
//   desc - description of choice to display.
// curtext - a list of all current lines that will be printed during the scene
function c(choice, curtext) {
    const html = "<li><a href=\"javascript:go('" + choice[0] + "')\">" + choice[1] + "</a>"
    curtext.push(html);
    return curtext;
}

// Cache a choice for a click listener
// choice - array of length 2 with tag on index 0 and desc on index 1
//   tag - function to activate using choice
//   desc - description of choice to display.
// loc - the name of the location used
function cListener(choice, loc){
    const html = "<p><li class='cListener' id='"+loc+"'>"+choice[1]+"</li></p>";
    document.getElementById('textsp').innerHTML += html;
}

//Adds an element to a created click listener
//This is done separately because if the list contains more listeners things break
function addListeners(choice, loc){
    let func = goWrapper(choice[0]);
    document.getElementById(loc).addEventListener("click", func);
}

//Calls the given visit through go, aka it triggers a game tick.
function goWrapper(func){
    return function () { go(func);}
}

//For a given list adds a listener to all created click listeners
function addListenersList(list){
    list.forEach(item => addListeners(item[0], item[1]));
}

//For the given choice creates both the element and the listener
function cListenerGen(choice, loc){
    cListener(choice, loc);
    addListeners(choice, loc);
}

//print the given lines list on the screen
function sayText(lines){
    let result = "";
    lines.forEach(item => result += "<p>" + item + "</p>");
    document.getElementById('textsp').innerHTML = result;
}

//Adds the given line list to the already existing screen.
function addSayText(lines){
    let result = "";
    lines.forEach(item => result += "<p>" + item + "</p>");
    document.getElementById('textsp').innerHTML += result;
}

function setText(lines){
    let result = "";
    lines.forEach(item => result += item);
    document.getElementById('textsp').innerHTML = result;
}

let json = null;
let locjson = null; //This is the main json for the current location

//This requests a json from the webserver with a given filename and callback function
//TODO probably find a way to store this
async function getjson(fileID, callback){
    const file = "JSON/" + fileID + ".JSON";
    const response= await fetch(file);
    json = await response.json();
    callback();
}

//This requests a json file from the webserver using the location tag
async function getjsonT(tag){
    const file = "JSON/" + tag + ".JSON";
    const response= await fetch(file);
    json = await response.json();
    calledjsons[tag] = json;
    eval(tag+"()");
}


//TODO handle formatting differently, probably have a list of indexes that need to be replaced instead
//This sets up all variables that this location uses.
function locationSetup(tag){
    locjson = JSON.parse(JSON.stringify(calledjsons[tag]));
    locjson.girlname = addGirlname(locjson.girlname);
    //TODO this can be more efficient (arraylist with all options)
    replaceWCI("intro", "girlname");
    replaceWCT("always", "girlname");
    replaceWCI("intro", "money");
    replaceWCT("always", "money");
}

//Setup of location when there are multiple locations in json file
function locationMSetup(tag, subtag){
    locjson = JSON.parse(JSON.stringify(calledjsons[tag][subtag]));
    if (locjson.hasOwnProperty("girlname"))
        locjson.girlname = addGirlname(locjson.girlname);
    if (locjson.hasOwnProperty("money"))
        locjson.money = addMoney(locjson.money);
    if (locjson.hasOwnProperty("girltalk"))
        locjson.girltalk = addGirlTalk(locjson.girltalk)
    //TODO this can be more efficient (arraylist with all options) with property
    //TODO instead of using {0} format outright replace the name0 thing with the right value
    replaceWCI("intro", "girlname");
    replaceWCT("always", "girlname");
    replaceWCI("intro", "money");
    replaceWCT("always", "money");
    replaceWCI("intro", "girltalk");
    replaceWCT("always", "girltalk");
    replaceChoices("girlname");
    if (locjson.hasOwnProperty("dialogue")){
        for (let [key, value] of Object.entries(locjson.dialogue)){
            if(locjson.dialogue.hasOwnProperty(key)){
                value = replaceWCLI(value, "girlname");
                value = replaceWCLI(value, "money");
                value = replaceWCLI(value, "girltalk");
                locjson.dialogue[key] = value;
            }
        }
    }
}

//Setup of location using a JSON that is not connected to a location
function locationMCSetup(subtag, customloc){
    locjson = JSON.parse(JSON.stringify(customloc[subtag]));
    if (locjson.hasOwnProperty("girlname"))
        locjson.girlname = addGirlname(locjson.girlname);
    if (locjson.hasOwnProperty("girltalk"))
        locjson.girltalk = addGirlTalk(locjson.girltalk)
    replaceWCI("intro", "girlname");
    replaceChoices("girlname");
    if (locjson.hasOwnProperty("dialogue")){
        for (let [key, value] of Object.entries(locjson.dialogue)){
            if(locjson.dialogue.hasOwnProperty(key)){
                value = replaceWCLI(value, "girltalk");
                locjson.dialogue[key] = value;
            }
        }
    }
}

//Replacing the variable wildcards of the given tag for the given json value
function replaceWCT(jsontag,tag){
    let result = [];
    locjson[jsontag].forEach(item => result.push(replaceCheck(item, tag)));
    locjson[jsontag] = result;
}

//Replacing the variable wildcards of the given tag for the given json value, where this is a list of lists
function replaceWCI(jsontag, tag){
    let result = [];
    locjson[jsontag].forEach(item => result.push(replaceWCL(item, tag)));
    locjson[jsontag] = result;
}

//Replacing the variable wildcards of the given tag for the given list
function replaceWCL(strlist, tag){
    let result = [];
    strlist.forEach(item => result.push(replaceCheck(item, tag)));
    return result;
}

//Replacing the variable wildcards of the given tag for the given list of lists
function replaceWCLI(strlist, tag){
    let result = [];
    strlist.forEach(item => result.push(replaceWCL(item, tag)));
    return result;
}

//Replacing the variable wildcard of the given tag for the given list, using the given checklist
function replaceWCLC(strlist, checklist, tag){
    let result = [];
    strlist.forEach(item => result.push(LreplaceCheck(item,checklist, tag)));
    return result;
}

function replaceWCLCI(strlist, checklist, tag){
    let result = [];
    strlist.forEach(item => result.push(replaceWCLC(item, checklist, tag)));
    return result
}

function replaceChoices(tag){
    let result = [];
    locjson["choices"].forEach(item => result.push(replaceChoice(item, tag)));
    locjson["choices"] = result
}

function replaceChoice(choice, tag){
    let result = [choice[0]];
    result.push(replaceCheck(choice[1], tag));
    return result
}

function replaceChoicesList(strList, tag, checkList ){
    let result = [];
    strList.forEach(item => result.push(replaceChoiceList(item, tag, checkList)));
    return strList;
}

function replaceChoiceList(choice, tag, checkList){
    let result = [choice[0]];
    result.push(LreplaceCheck(choice[1], checkList, tag));
    return result
}

function replaceCheck(rpstring, tag){
    const list = locjson[tag];
    if (rpstring.includes(tag)){
        rpstring = rpstring.replace(tag, "");
        return list[Number(rpstring)];
    } else {
        return rpstring;
    }
}

function LreplaceCheck(rpstring, list, tag){
    if (rpstring.includes(tag)){
        rpstring = rpstring.replace(tag, "");
        return list[Number(rpstring)];
    } else {
        return rpstring;
    }
}

//calls all json requests to get recurring quotes
function setupQuotes(){
    getjson("flirting", flirtSetup);
    getjson("needs", needSetup);
    getjson("yneeds", yNeedSetup);
    getjson("youpee", yPeeSetup);
    getjson("shepee", shePeeSetup);
    getjson("drinking", function (){
        drinklines = json;
    });
    //TODO format this json better?
    getjson("appearance", function (){
        appearance = json;
    } );
    getjson("drive", function () {
        drive = json;
    });
    getjson("general", function (){
        general = json;
    });
    getjson("games/darts", dartSetup);
}

function flirtSetup(){
    flirtquotes = json.flirt;
    let rawresp = json.respons;
    flirtresps = {};
    for (let [key, value] of Object.entries(rawresp)){
        if (key === "bad"){
            flirtresps[key] = addGirlTalk(value);
        } else {
            flirtresps[key] = addGirlname(value);
        }
    }
    feelUp = json.feel;
    feelUp["resp"] = formatAllVars(feelUp["resp"]);
    feelUp["bad"] = formatAllVars(feelUp["bad"]);
    kissing = json.kiss;
    kissing["diag"] = formatAllVarsList(kissing["diag"]);
}


function needSetup(){
    needs = json;
    needs["girltalk"] = addGirlTalk(needs["girltalk"]);
    needs["girlname"] = addGirlname(needs["girlname"]);
    needs["girlgasp"] = addGirlGasp(needs["girlgasp"]);
    needs["askpee"] = replaceWCLC(needs["askpee"], "girlname", needs["girlname"]);
    needs["askpee"] = replaceWCLC(needs["askpee"], "girltalk", needs["girltalk"]);
    needs["preventpee"] = replaceChoicesList(needs["preventpee"], "girlname", needs["girlname"]);
    needs["pstory"] = replaceWCLC(needs["pstory"], "girlname", needs["girlname"]);
    needs["holdit"]["girltalk"] = addGirlTalk(needs["holdit"]["girltalk"]);
    needs["holdit"]["girlgasp"] = addGirlGasp(needs["holdit"]["girlgasp"]);
    needs["holdit"]["dialogue"] = replaceWCLC(needs["holdit"]["dialogue"], needs["holdit"]["girltalk"], "girltalk");
    needs["holdit"]["dialogue"] = replaceWCLC(needs["holdit"]["dialogue"], needs["holdit"]["girlgasp"], "girlgasp");
    needs["begtoilet"]["girlname"] = addGirlname(needs["begtoilet"]["girlname"]);
    needs["begtoilet"]["dialogue"] = replaceWCLC(needs["begtoilet"]["dialogue"], needs["begtoilet"]["girlname"], "girlname");
    needs["briberoses"] = replaceWCLC(needs["briberoses"], needs["girltalk"],"girltalk");
    needs["bribefavor"] = replaceWCLC(needs["bribefavor"], needs["girltalk"],"girltalk");
    needs["payholdit"] = replaceWCLC(needs["payholdit"], needs["girltalk"],"girltalk");
    needs["payfails"] = replaceWCLC(needs["payfails"], needs["girltalk"],"girltalk");
    needs["bribeearrings"] = replaceWCLC(needs["bribeearrings"], needs["girltalk"],"girltalk");
    needs["allowpee"] = replaceWCLC(needs["allowpee"], needs["girltalk"],"girltalk");
    needs["holdpurse"] = replaceWCLC(needs["holdpurse"], needs["girltalk"], "girltalk");
    needs["vase"] = replaceWCLCI(needs["vase"], needs["girltalk"], "girltalk");
    needs["vase"] = replaceWCLCI(needs["vase"], needs["girlname"], "girlname");
    needs["shotglass"] = replaceWCLCI(needs["shotglass"], needs["girltalk"], "girltalk");
    needs["shotglass"] = replaceWCLCI(needs["shotglass"], needs["girlname"], "girlname");
    needs["ptowels"] = replaceWCLCI(needs["ptowels"], needs["girltalk"], "girltalk");
    needs["ptowels"] = replaceWCLCI(needs["ptowels"], needs["girlname"], "girlname");
    needs["champ-glass"] = replaceWCLCI(needs["champ-glass"], needs["girltalk"], "girltalk");
    needs["peeintub"] = replaceWCLC(needs["peeintub"], needs["girltalk"], "girltalk");
    needs["peeintub"] = replaceWCLC(needs["peeintub"], needs["girlgasp"], "girlgasp");
    needs["wetquote"] = addGirlname(needs["wetquote"]);
    needs["drinkquote"] = addGirlname(needs["drinkquote"]);
    toldstories = range(0, needs["peestory"].length);
}

//Girl curses
//TODO implement curses in json
function voccurse(curtext) {
    curtext.push(girltalk + " " + pickrandom(curseword));
    return curtext;
}

function yNeedSetup(){
    yneeds = json;
    //This starts the game. Reason it's done here is because yourhome is dependent on yneeds to be defined
    //And this is the cleanest way to not have everything crying
    yneeds["girlname"] = addGirlname(yneeds["girlname"]);
    yneeds["shotglass"] = replaceWCLCI(yneeds["shotglass"], yneeds["girlname"], "girlname");
    yneeds["vase"] = replaceWCLCI(yneeds["vase"], yneeds["girlname"], "girlname");
    go("yourhome");
}

function yPeeSetup(){
    //TODO cleanup like shePeeSetup
    json["girlname"] = addGirlname(json["girlname"]);
    json["girltalk"] = addGirlTalk(json["girltalk"]);
    json["locked"]["girlname"] = addGirlname(json["locked"]["girlname"]);
    let templist = json["thehome"][0];
    let result = [];
    templist.forEach(item => result.push(LreplaceCheck(item, json["girlname"], "girlname")));
    templist = result;
    result = []
    templist.forEach(item => result.push(LreplaceCheck(item, json["girltalk"], "girltalk")));
    json["thehome"][0] = result;
    result = [];
    templist = json["locked"]["urgency"]
    templist.forEach(item => result.push(LreplaceCheck(item, json["locked"]["girlname"], "girlname")));
    json["locked"]["urgency"] = result;
    result = [];
    templist = json["beg"][0];
    templist.forEach(item => result.push(LreplaceCheck(item, json["girltalk"], "girltalk")));
    json["beg"][0] = result;
    ypeelines = json;
}

function shePeeSetup(){
    peelines = json;
    peelines["girlname"] = addGirlname(peelines["girlname"]);
    peelines["girltalk"]= addGirlTalk(peelines["girltalk"]);
    peelines["locked"]["girltalk"] = addGirlTalk(peelines["locked"]["girltalk"]);
    peelines["thehome"] = replaceWCLC(peelines["thehome"], peelines["girlname"], "girlname");
    peelines["noneavailable"] = replaceWCLC(peelines["thehome"], peelines["girlname"], "girlname");
    peelines["remaining"] = replaceWCLC(peelines["thehome"], peelines["girlname"], "girlname");
    let temp = [];
    peelines["peephone"].forEach(item => temp.push(replaceWCLC(item, peelines["girltalk"], "girltalk")));
    peelines["peephone"] = temp;
    peelines["locked"]["cbar"] = replaceWCLC(peelines["locked"]["cbar"], peelines["locked"]["girltalk"], "girltalk");
    peelines["locked"]["cclub"] = replaceWCLC(peelines["locked"]["cclub"], peelines["locked"]["girltalk"], "girltalk");
}


function handleFlirt(curtext){
    let result = [];
    let choice = [];
    let low = "low";
    let med = "med";
    if(locstack[0] === "callher"){
        low += "cell";
        med += "cell";
    }
    result.push([flirtquotes[low][randcounter]]);
    choice.push("flirt_l");
    incrandom();
    if (Math.floor(Math.random() * 7) === 0 || locstack[0] !== "callher"){
        choice.push("flirt_h");
        result.push([flirtquotes["high"][randcounter]]);
    } else {
        choice.push("flirt_m");
        result.push([flirtquotes[med][randcounter]]);
    }
    const build = "Tell her {0}.";
    for (let i = 0; i < result.length; i++){
        curtext = c([choice[i], formatString(build, result[i])], curtext);
    }
    return curtext;
}


