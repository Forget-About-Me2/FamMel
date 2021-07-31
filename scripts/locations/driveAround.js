import {locations} from "../locations.js"

export function driveAroundSetup(){
    return {
        "visit": ["driveAround", "Just drive around"],
        "group": 0,
        "visited": -1,
    }
}

export function driveAround(){
    locations.driveAround.visited = 1;
}