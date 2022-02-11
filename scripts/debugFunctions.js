//These are functions that might regularly be used to debug the code.
//Functions are added as needed

function allItems(){
    Object.keys(objects).forEach(key => objects[key].value = 2);
}