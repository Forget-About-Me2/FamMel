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

export function setErrorPopup(data: string){
    const popUp = document.GetRequiredElementById<HTMLElement>("pop-up");
    popUp.style.display = "flex";
    const closeButton = document.GetRequiredElementById<HTMLElement>("close-pop-up");
    closeButton.style.display = "none";

    window.onclick = null; // Remove the event listener to prevent closing on click outside
    const title = document.GetRequiredElementById<HTMLElement>("pop-up-title");
    const text = document.GetRequiredElementById<HTMLElement>("pop-up-text");

    title.innerText = "Error page";
    text.innerHTML = "<p>Oh oh, Something went wrong running the game.</p>" +
        "<p>Sorry for the inconvenience.</p>" +
        "<p>Issues with the game can be reported through <a href='https://github.com/Forget-About-Me2/FamMel/issues'>github</a></p>"+
        "<p>When doing so please be as detailed as possible about what caused the error.</p>"+
        "<p>In the box below is some extra error information that can help in solving the issue, please include in any report.</p>"+
        "<div id='errorMessage'>"+ data + "</div>" +
        "<br> <button id='copyErrorMessage'>Copy text</button>"
    const button = document.GetRequiredElementById<HTMLElement>("copyErrorMessage");
    button.onclick = () => {
        const errorMessage = document.GetRequiredElementById<HTMLElement>("errorMessage");
        navigator.clipboard.writeText(errorMessage.innerText);
    };
}

export function exposePopUpOnWindow(): void {
    const w = window as any;
    w.openPopUp = openPopUp;
    w.setErrorPopup = setErrorPopup;
}