function closeMacPopup() {
    document.getElementById("parentpopup").style.display = "none";
    var properties = getPopupProperties();
    properties.currentState = "inactive";
    setPopupProperties(properties);
}
function openMacPopup() {
    document.getElementById("parentpopup").style.display = "block";
    var properties = getPopupProperties();
    properties.currentState = "active";
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
        properties.isFullScreen = !properties.isFullScreen
    }
    else {
        makePopupHalfScreen(parentpopup);
        properties.isFullScreen = !properties.isFullScreen
    }
    // save the current state of the popup
    savePopupCurrentState(properties);
    properties = getPopupProperties();
    console.log(properties.currentState);

}
function makePopupFullScreen(parentpopup) {
    // get the padding and margin of the popup inorder to remove over lap on the screen when popup is full width
    let minusThePaddingAndMargin = getComputedStyleElement(parentpopup, 'padding-left') + getComputedStyleElement(parentpopup, 'padding-right')
    parentpopup.style.width = `${window.innerWidth - minusThePaddingAndMargin}px`;
    parentpopup.style.left = `0px`;
    parentpopup.style.top = `0px`;
    savePopupCurrentState();
}
function makePopupHalfScreen(parentpopup) {
    let centerOfScreen = window.innerWidth * 0.2;
    parentpopup.style.left = `${centerOfScreen}px`;
    parentpopup.style.top = `${window.innerWidth * 0.03}px`;
    parentpopup.style.width = `${window.innerWidth / 2}px`;
    savePopupCurrentState();
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
            currentState: (parentpopup.style.display != "" && parentpopup.style.display != "none") ? "active" : "inactive",
            isFullScreen: window.innerWidth - parentpopup.offsetWidth <= 60,
        };
    }
    else {
        json = properties;
    }
    setPopupProperties(json);
}

function startDragPopup() {
    var parentpopup = document.getElementById("parentpopup");
    var child = document.getElementById("popupactionbuttons");
    var posfirstX = 0,
        posfirstY = 0,
        poslastX = 0,
        poslastY = 0;
    parentpopup.onmousedown = dragElementOnMouseDown;
    function dragElementOnMouseDown(e) {
        e.preventDefault();
        // get the mouse cursor position at startup:
        poslastX = e.clientX;
        poslastY = e.clientY;
        document.onmouseup = releaseDragOnMouseUp;
        // call a function whenever the cursor moves:
        document.onmousemove = moveParentPosition;
    }

    function moveParentPosition(e) {
        e = e || window.event;
        e.preventDefault();
        var properties = getPopupProperties();

        // calculate the new cursor position:
        posfirstX = poslastX - e.clientX;
        posfirstY = poslastY - e.clientY;
        // set the last position to new position  of the cursor:
        poslastX = e.clientX;
        poslastY = e.clientY;
        // set the element's new position:
        child.style.cursor = "move";
        parentpopup.style.top = `${parentpopup.offsetTop - posfirstY}px`;
        parentpopup.style.left = `${parentpopup.offsetLeft - posfirstX}px`;
        savePopupCurrentState()
    }

    function releaseDragOnMouseUp() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
        child.style.cursor = "unset";

    }
}