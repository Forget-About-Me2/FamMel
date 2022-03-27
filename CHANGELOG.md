#version 0.5.3
* Fixed the sex scenes breaking when she's bursting
* Fixed the game breaking when you pee outside at the car.
* Fixed dialogue sometimes being printed twice when she asks to go.
* Fixed dialogue of her asking questions while you're in the bar.
* Fixed a double game tick happening in the beginning.
* Fixed pacing when buying an item. (It takes 2 ticks now instead of 3)

#version 0.5.2
* Fixed buying items being broken.
* Fixed you being stuck when finishing a movie after closing time.
* Fixed flirt options not properly randomizing
* Fixed the game breaking when you tried to go to a locked bathroom
* Fixed missing dialogue when she mentions needing to go.
* Fixed some quotes
* Gave the waiting for elevator scene more variety, so it looks like you actually did something if you click continue.

#version 0.5.1
* Fixed bug where it showed undefined when visiting closed venues
* Added options to flirt while dancing
* Fixed typo in the girlname for appearence, which broke both the bar game and checking her out when using Melissa as a basegirl
* Fixed that at some places you or her having an accident can break the game.
* Fixed a bug with you peeing outside in the yard.
* Fixed that your bladder doesn't actually empty when peeing outside while she's watching.
* Fixed the game breaking when you pee in the hot tub.
* Fixed game breaking when leaving the hot tub.
* Fixed game breaking when going back to the car.
* Fixed the game breaking when leaving a make-out session in the hot tub.
* Fixed the champagne counter becoming negative, and therefore not triggering the event it should.
* Fixed her saying you already asked her to hold it 0 times
* Fixed that the game displayed the scene where you stole the keys while you haven't.
* Fixed the duplicate text when you leave a venue, and she asks to go.
* Fixed that you can leave the bar when you or her are having an accident.
* Fixed that when buying an item it adds the wrong amount to the inventory.
* Fixed the dart game being formatted wrong.
* Fixed the wrong name sometimes showing up after reloading the game with a custom girl.
* Fixed broken quite when you pee into the champagne glass in the car.
* Fixed the wrong scene playing when you ask to use her toilet.

# Version 0.5.0 
From this version on the version numbers have been changed to better represent the current state of the game.
This version involves the beginning of an improved game engine, but this is still a work in process. 
This is a major update but mainly for under the hood, the game play has been kept mostly the same with some small additions. 
The game has been given a slightly updated look, though still needs some work.

~ Troder

* Moving quotes to JSON, this means that the game now needs to be run through a webserver in order to work
* Settings are now saved between sessions
* Fixed the loop with a certain end-scene of the drinking game
* Changed the way pictures are added
* Changed with how much cocktails increase max-tummy
* Tweaked chance of finding key to hopefully be a bit more favourable
* Fixed bug that reset the flirt counter when trying to leave
* Fixed her asking to go pee if she doesn't have to go during pickup
* Fixed that you and her use the same counter for a locked bathroom
* Changed volume of water bottles and beer to 250ml to be slightly more realistic
* Added option to turn off playerBladder
* Added a backpack which works as an inventory
* Removed debug mode
* Added the option to always ask her to pee into something, without caring about her need
* Added a gas station
* Tweaked the insistent asking to pee:
* She should be slightly less pushy about needing to go to the bathroom when desperate
* When selling panties you now get the option to buy more beer.
* Added more topics for talking in the bar.
* Added dart game
* There can now be a line for the bathroom in the theatre
* the statusbar now just flashes temporary when an attribute changes instead of until the next button is pressed
* The flashing of the statusbar now differentiates between positive(green) and negative(red) changes
* During the movie, now the only time attraction checks are used are at the beginning and the end.
* Buying has been changed, so you can now buy up to 100 items at the same time, provided you have the money.
* Stealing is unchanged for now, as it actually takes effort on the player's part.
* Some bugs for the photoGame have been fixed

# version 4.2
This update involves some general bug fixes and some code clean-up. 
Also, a start has been made to have split from being one big html file into several smaller files.

~ Troder

* Tweaked the chance of spurting instead of fully wetting
* Fixed a game breaking bug in the drinking game
* Changed the chance she'll hold it if you ask when she's desperate
* Code cleanup
* Fixed the bug were bladder-limits weren't updated when choosing a preset girl
* Fixed that you still drink soda even if your tummy is full
* Fixed the bug where she only asks for the bar, all the time
* First start on splitting the code into multiple files
* Changed the way stats are handled to be a bit more elegant
* Replaced all deprecated code
* Changed lost attraction if you make her drink while desperate
* Fixed that the wrong dialogue appears when you lose control during the drinking game
* Changed end scenes for the drinking game
* You can now keep buying drinks in a row.

# version 4.1
Major improvement for the player bladder feature.

~ Troder

* Added possibilities for you to pee when the bathroom is unavailable
* Tweaked how the bladders fill a tiny bit. Not noticeable for players.
* fixed a bug where you didn't lose control during the drinking game
* Slight code cleanup
 *She no longer takes the vase/shot glass to the bathroom with her when you are in the car/outside
* At the end of the drinking game you no longer automatically go to the bathroom
* She no longer asks for the bar if you have already been there
* When you're alone she will no longer ask you to hold her purse
* You can now set a custom capacity for your bladder
* increased the amount of money you have, since you now also need to buy for yourself
* You can now only go to the bathroom if you actually need to go
* You can now pee in the tub
* You now can't have sex with her if she is still wearing bottoms
* You no longer can change the options mid-game
* Fixed a bug that caused a line to be said twice
* You no longer automatically lose attraction if you ask her to hold it and she's not desperate
* Started organizing the clutter that happens when you have a lot of items
* You can now drink with her
* You can ask her how she is doing when she's holding it for you
* Added an option to change how much money you have

# version 4.0
My first additions to this game. Most notable is the implementation of the player bladder.

~Troder(ForgetAboutMe)

* fixed some game-breaking bugs with rarer scenes
* General bug fixes
* changed the html so now the game is in the full browser screen instead of only part of it.
* You can now kiss and feel her up in the dark bar
* Added a make-out option to the hot tub
* Clothes now get reset when leaving a make-out session(beach and hot-tub)
* fixed some typos
* Added the option to be able to repeat actions during a make-out/sex session
* Added the option to have actions reset between make-out/sex sessions
* In the theatre you can now ask her which movie she wants to watch
* Tweaked the success of actions during the movie a bit.
* Implemented PlayerBladder - needs better scenes

# version 3.2.3 (by: OLRAST)
* Removed tracking code (injected by a hosting site?)


# version 3.2.2 (by: OLRAST)
* Fixed image flicker

# version 3.2.1 (by: OLRAST)

* Setting custom girl bladder capacity works now
* When using a custom girl with JPG pictures, pictures of the girl she's based on are displayed

# version 3.1? (by: drw)
I think this is version 3.1, it has not been documented very well, unfortunately. It has been years since this was done so there is no way to be sure.

~Troder

* Ability to make a custom girl 
* Elevator hijinx - she can wet herself, and sometimes
    somebody comes out of the elevator. 
* New outfit: jeans and black tee - both tight. 
* Records empty champagne bottle
* Bladder size reduces when she holds it too long.
* Enhanced debug mode
* Flirting with the lady bartender in the club -> jelousy
* Began modification for solo activities and started solo bargirl scene.
    *  Somewhat Enhanced solo bargirl scene. 
* Made wetting the bed a non-losing option. 
* Added possibility to take her keys or cellphone when you let her go pee.
* Added lost keys functionality to apartment 
* Massively Enhanced solo bargirl scene.

