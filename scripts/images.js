let imgs = {
    Jennifer:{},
    Karen:{},
    Laura:{},
    Melissa:{}
};

//sets imgs to the local stored version
function importimgs(){
    imgString = localStorage["imgs"];
    imgs = JSON.parse(imgString);
}

//resets imgs to the default version
function resetImg(){
    imgs = {
        Jennifer:{},
        Karen:{},
        Laura:{},
        Melissa:{}
    };
    localStorage.removeItem("imgs");
    createSelect();
    getUrl();
}

let picset = 0;
// displaypix will set the current picture to be displayed
//TODO figure out why need is called before urge
function displaypix(picname) {
    imgssrc = imgs[basegirl][picname];
    if (enableimages && withgirl && imgssrc !== imageprev && !enablehide && !picset) {
        document.getElementById('thepic').innerHTML = "<img src=" + imgssrc + " alt=" + imagedesc + " class='pic'>";
    }
    imageprev = imgssrc;
}

//TODO proper explanation on how setup works
//TODO show picture of first thing that's called
function explainimgs() {
    setjpgimgs();
    setText(json.picsetup);
    picsetup();
}

function picsetup(){
//Set up html
    if(localStorage.imgs) {
        //TODO check if this is the right place for the import
        importimgs();
    }
    createSelect();
    const girls = document.getElementById("girlname");
    girls.onchange = getUrl;
    const cusgirl = document.getElementById("addgirl");
    cusgirl.onclick = addGirl;
    const imgtypes = document.getElementsByName("imgtype");
    for(let i=0; i<imgtypes.length; i++ ){
        imgtypes.item(i).onclick = getUrl;
    }
    const update = document.getElementById('update');
    update.onclick = updateLink;
    const delgirl = document.getElementById('deletename');
    delgirl.onclick = delGirl;
    const picReset = document.getElementById('picreset');
    picReset.onclick = resetImg;
    picset = 1;
    getUrl();
}

function createSelect(){
    let result = '';
    for (let girlname in imgs){
        result += `<option value=${girlname} name="girl">${girlname}`;
    }
    document.getElementById("girlname").innerHTML=result;
}

function getUrl(){
    const e = document.getElementById("girlname");
    const name = e.options[e.selectedIndex].value;
    const imgtype = $("input[name=imgtype]:checked").val();
    const urlbox = document.getElementById("imgurl");
    if (imgs[name].hasOwnProperty("pix" + imgtype)){
        src = imgs[name]["pix" + imgtype];
        urlbox.value = src;
        document.getElementById('thepic').innerHTML = "<img src=" + src + " alt=" + imagedesc + " class='pic'>";
    } else {
        urlbox.value = name + "-" + imgtype;
    }

}

function updateLink(){
    const e = document.getElementById("girlname");
    const name = e.options[e.selectedIndex].value;
    const imgtype = $("input[name=imgtype]:checked").val();
    const temp = document.getElementById('update');
    const url = document.getElementById('imgurl').value;
    document.getElementById("thepic").innerHTML = "<img src=" + url + "' alt='Picture of girl' class= 'pic'>";
    picStore(name, imgtype, url);
}

function addGirl(){
    const field = document.getElementById('cusgirl');
    const name = field.value;
    field.value = "";
    if (name === ""){
        alert("Everyone has a name, even this fictional girl. \n" +
            "Please fill in a name");
    } else {
        imgs[name] = {}
        if (typeof (Storage) !== "undefined") {
            localStorage.setItem("imgs", JSON.stringify(imgs))
        }
        createSelect();
    }
}

function delGirl(){
    const e = document.getElementById("girlname");
    const name = e.options[e.selectedIndex].value;
    delete imgs[name];
    if(typeof(Storage) !== "undefined"){
        localStorage.setItem("imgs", JSON.stringify(imgs))
    }
    createSelect();
    getUrl();
}

function picStore(name, imgtype, url){
    if(!imgs[name]){
        imgs[name]={};
    }
    //TODO potentially change naming of image calls
    imgs[name]["pix" + imgtype]= url;
    if(typeof(Storage) !== "undefined"){
        localStorage.setItem("imgs", JSON.stringify(imgs))
    }
}