//All functions related to opening and closing the pop-up

//Carry out what is needed to set up a pop up once it opens.
export function openPopUp(){
    const popUp = document.GetRequiredElementById<HTMLElement>("pop-up");
    popUp.style.display= "flex";
    setCloseButton();
}

function setCloseButton(){
    const popUp = document.GetRequiredElementById<HTMLElement>("pop-up");
    const btn = document.GetRequiredElementById<HTMLElement>("close-pop-up");
    btn.style.display = "flex"
    btn.onclick = function(){
        popUp.style.display = "none";
    }
    window.onclick = function(event){
        if (event.target === popUp)
            popUp.style.display = "none";
        window.onclick = null; // Remove the event listener after closing
    }
}