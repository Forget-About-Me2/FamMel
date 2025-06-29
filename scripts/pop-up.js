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
        window.onclick = null; // Remove the event listener after closing
    }
}

function setErrorPopup(data){
    const popUp = document.getElementById("pop-up");
    popUp.style.display = "flex";
    const closeButton = document.getElementById("close-pop-up");
    closeButton.style.display = "none";
    window.onclick = null; // Remove the event listener to prevent closing on click outside
    document.getElementById("pop-up-title").innerText = "Error page";
    document.getElementById("pop-up-text").innerHTML = "<p>Oh oh, Something went wrong running the game.</p>" +
        "<p>Sorry for the inconvenience.</p>" +
        "<p>Issues with the game can be reported through <a href='https://github.com/Forget-About-Me2/FamMel/issues'>github</a></p>"+
        "<p>When doing so please be as detailed as possible about what caused the error.</p>"+
        "<p>In the box below is some extra error information that can help in solving the issue, please include in any report.</p>"+
        "<div id='errorMessage'>"+ data + "</div>" +
        "<br> <button id='copyErrorMessage' onclick='copyErrorText()'>Copy text</button>"
}

async function copyErrorText(){
    const errorMessage = document.getElementById("errorMessage");// For mobile devices

    navigator.clipboard.writeText(errorMessage.innerText).then(async () => {
            const button = document.getElementById("copyErrorMessage");
            button.innerText = "Copied successfully";
            await delay(1000);
            button.innerText = "Copy text";
        }
    )
}

const delay = ms => new Promise(res => setTimeout(res, ms));


// window.onunhandledrejection = (errorMsg, url, lineNumber, column, errorObj) => {
//     console.log("fuck");
//     const message = 'Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber
//         + ' Column: ' + column + ' StackTrace: ' + errorObj;
//     setErrorPopup(message)
// }