
function driveAroundSetup(){
    return {
        "visit": ["driveAround", "Just drive around"],
        "group": 0,
        "visited": -1,
   }
}

function driveAround(){
    locations.driveAround.visited = 1;
}