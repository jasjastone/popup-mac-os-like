function closeMacPopup() {
    document.getElementById("parentpopup").style.display = "none";
    var properties = getPopupProperties();
    properties.currentStatte = "inactive";
    setPopupProperties(properties);
}
function openMacPopup() {
    document.getElementById("parentpopup").style.display = "block";
    var properties = getPopupProperties();
    properties.currentStatte = "active";
    setPopupProperties(properties);
}
function toogleFullScreen() {
    const parentpopup = document.getElementById("parentpopup");
    var properties = getPopupProperties();
    if (properties == null) {
        // save current state before changing the positions
        savePopupCurrentState();
        properties = getPopupProperties();

    }
    if (properties.isFullScreen) {
        makePopupFullScreen(parentpopup);
        properties.isFullScreen =!properties.isFullScreen
    }
    else {
        makePopupHalfScreen(parentpopup);
        properties.isFullScreen =!properties.isFullScreen
    }
    // save the current state of the popup
    savePopupCurrentState(properties);
    properties = getPopupProperties();
    console.log(properties.currentStatte);

}
function makePopupFullScreen(parentpopup) {
    parentpopup.style.left = `0px`;
    parentpopup.style.top = `0px`;
    // get the padding and margin of the popup inorder to remove over lap on the screen when popup is full width
    let minusThePaddingAndMargin = getComputedStyleElement(parentpopup, 'margin-left') + getComputedStyleElement(parentpopup, 'margin-right') + getComputedStyleElement(parentpopup, 'padding-left') + getComputedStyleElement(parentpopup, 'padding-right')
    parentpopup.style.width = `${window.innerWidth - minusThePaddingAndMargin}px`;
}
function makePopupHalfScreen(parentpopup) {
    let centerOfScreen = window.innerWidth *0.2;
    parentpopup.style.left = `${centerOfScreen}px`;
    parentpopup.style.top = `${window.innerWidth*0.03}px`;
    parentpopup.style.width = `${window.innerWidth / 2}px`;
}
function dragPopupPosition(event) {
    const parentpopup = document.getElementById("parentpopup");
    var properties = getPopupProperties();
    // if null means we haven't already save the state of the popup
    if (properties == null) {
        savePopupCurrentState();
        properties = getPopupProperties();
    }
    if (properties.isFullScreen) {
        // reduce the popup with to half of the window inorder to be dragable
        parentpopup.style.width = `${window.innerWidth / 2}px`;
    }
    properties.isFullScreen = false;
    parentpopup.style.left = `${event.pageX - (parentpopup.offsetWidth / 2)}px`;
    parentpopup.style.top = `${event.pageY - 10}px`;
    savePopupCurrentState(properties);
}


function getComputedStyleElement(element, cssprop) {
    return parseFloat(window.getComputedStyle(element, cssprop).getPropertyValue(cssprop))
}
function getPopupProperties() {
    return JSON.parse(localStorage.getItem("macpopupproperties"));
}
function setPopupProperties(json) {
    localStorage.setItem("macpopupproperties", JSON.stringify(json));
}
function savePopupCurrentState(properties = null) {
    let json = {};
    if (properties == null) {
        const parentpopup = document.getElementById("parentpopup")
        const positionoftheopup = parentpopup.getBoundingClientRect();
        json = {
            width: positionoftheopup.width,
            height: positionoftheopup.height,
            position: { x: positionoftheopup.x, y: positionoftheopup.y },
            currentStatte: (parentpopup.style.display != "" && parentpopup.style.display != "none") ? "active" : "inactive",
            isFullScreen: window.innerWidth - parentpopup.offsetWidth <= 60,
        };
    }
    else {
        json = properties;
    }
    setPopupProperties(json);
}