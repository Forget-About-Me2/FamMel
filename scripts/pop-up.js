//All functions related to opening and closing the pop-up

//Carry out what is needed to set up a pop up once it opens.
function openPopUp(){
    const popUp = document.getElementById("pop-up");
    popUp.style.display= "flex";
    setCloseButton();
}

function setCloseButton(){
    const popUp = document.getElementById("pop-up");
    const btn = document.getElementById("close-pop-up");
    btn.style.display = "flex"
    btn.onclick = function(){
        popUp.style.display = "none";
    }
    window.onclick = function(event){
        if (event.target === popUp)
            popUp.style.display = "none";
    }
}

//Open the pop-up for 5 seconds before it's possible to close it.
//Mainly used for the disclaimer
function openPopUpTemp(){
    const popUp = document.getElementById("pop-up");
    popUp.style.display = "flex";
    const btn = document.getElementById("close-pop-up");
    btn.innerText = "5";
    let count = 4;
    let counter = setInterval(function (){
        if(count === 0){
            btn.innerHTML = "&times;"
            setCloseButton();
            clearInterval(counter);
        } else {
            btn.innerText = count.toString();
            count--;
        }
    }, 1000);
}