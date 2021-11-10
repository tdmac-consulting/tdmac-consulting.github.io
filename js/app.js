
/* --------Functions-------- */
/* ---Global Functions--- */
/* Create an array of the classes an element has (DO NOT CALL) */
const arrLoop = (arr, statement) => {
    for (let i = 0; i < arr.length; i++){
        statement;
    };
};
/* If function (DO NOT CALL)*/
const ifFunc = (condition, trueStatement, elseStatement) => {
    if (condition) {
        trueStatement;
    } else {
        elseStatement
    };
};

/* Creates an array of class names of an element (NOT <svg> COMPATIBLE) */
const classArray = (element) => {
    let elementClassList = element.className;
    let elementClassArray = elementClassList.split(' ');
    return elementClassArray;
};

/* Find the Index of the class you are searching for */
const findClassIndex = (element, classToFind) => {
    let array = classArray(element);
    for (let i = 0; i < array.length; i++){
        let classIndex = array.indexOf(classToFind);
        if (array.includes(classToFind)) {
            return classIndex;
        } else {
            console.log(`"${classToFind}" is not a class of #${element.id}, see list: ${array.join(', ')}`);
        };
    };
};
/* Removes any class from an document object */
const removeClass = (element, classToRemove) => {
    let array = classArray(element);
    let indexToRemove = findClassIndex(element, classToRemove);
    array.splice(indexToRemove, 1);
    element.className = array.join(' ');
};

/* Adds any class to a document object */
const addClass = (element, classToAdd) => {
    element.className += " " + classToAdd;
};

/* Replaces any class of a document object */
const replaceClass = (element, classToRemove, classToAdd) => {
    removeClass(element, classToRemove);
    addClass(element, classToAdd);
};

/* Toggles any class of a document object */
const toggleClass = (element, classToToggle) => {
    let elementClassArray = classArray(element);
    if (elementClassArray.includes(classToToggle)) {
        removeClass(element, classToToggle);
    } else {
        addClass(element, classToToggle);
    };
};

/* Applies a class to an array of document objects */
const applyClassToAll = (arr, classToApply) => {
    for (let i = 0; i < arr.length; i++) {
        let element = document.querySelector(arr[i]);
        let elementClasses = classArray(element);
        if (!elementClasses.includes(classToApply)) {
            addClass(element, classToApply);
        };
    };
};

/* Removes a class from an array of document objects */
const removeClassFromAll = (arr, classToApply) => {
    for (let i = 0; i < arr.length; i++) {
        let element = document.querySelector(arr[i]);
        let elementClasses = classArray(element);
        if (elementClasses.includes(classToApply)) {
            removeClass(element, classToApply);
        };
    };
};
/* Defines an array of property values from an array of objects
    array must be formatted:
    array = [
        {
            key: value,
            key: value,
        },
        {
            key: value,
            key: value,
        },
    ];
*/
const defineKeyValueArr = (arr, key) => {
    let output =[];
    for (i = 0; i < arr.length; i++) {
        output.push(arr[i][key]);
    }
    return output;
};

/* Toggles an activeOff class on an output:
-- if a input's corresponding output does not have activeOff class then class is added;
-- if a input's corresponding output does have activeOff class:
-- -1- ensure all outputs in group have activeOff class, adding any missing activeOff classes.
-- -2- remove the activeOff class from the corresponding menu, to activate it.
*/
const toggleActiveOffClass = (event, arr, inputProp, outputProp, activeClass) => {
    let inputArr = defineKeyValueArr(arr, inputProp);
    let outputArr = defineKeyValueArr(arr, outputProp);
    let eventId = event.target.id;
    for (let i = 0; i < inputArr.length; i++){
        let inputElement = inputArr[i].slice(1);
        let outputElement = document.querySelector(outputArr[i]);
        if (eventId == inputElement) {
            if (!classArray(outputElement).includes(activeClass)) {
                addClass(outputElement, activeClass);
            } else {
                applyClassToAll(outputArr, activeClass);
                removeClass(outputElement, activeClass);
            };
        };
    };
};
/* Toggles an activeOn class on an output:
-- if a input's corresponding output does have activeOn class then class is removed;
-- if a input's corresponding output does not have activeOn class:
-- -1- ensure all outputs in group do not have activeOn class, removing any remaining activeOn classes.
-- -2- adds the activeOn class to the corresponding menu, to activate it.
*/
const toggleActiveOnClass = (event, arr, inputProp, outputProp, activeClass) => {
    let inputArr = defineKeyValueArr(arr, inputProp);
    let outputArr = defineKeyValueArr(arr, outputProp);
    let eventId = event.target.id;
    for (let i = 0; i < inputArr.length; i++){
        let inputElement = inputArr[i].slice(1);
        let outputElement = document.querySelector(outputArr[i]);
        if (eventId == inputElement) {
            if (classArray(outputElement).includes(activeClass)) {
                removeClass(outputElement, activeClass);
            } else {
                removeClassFromAll(outputArr, activeClass);
                addClass(outputElement, activeClass);
            };
        };
    };
};

const toggleMenuDropdowns = (event, arr) => {
    toggleActiveOffClass(event, arr, "button", "menu", "hidden");
    toggleActiveOnClass(event, arr, "button", "arrow", "transform");
    toggleActiveOnClass(event, arr, "button", "arrow", "rotate-180");
};

/* --------Constants-------- */
/* Main Document Selectors */
const header = document.querySelector('body>header');
const main = document.querySelector('body>main');

/* Mobile Menu Constants */
const mobileMenuToggleButton = document.querySelector('#toggleMobileMenuButton');
const mobileMenu = document.querySelector('#toggleMobileMenu');


/* ----------- Event Listeners ----------- */
/* ----- Menu Events -----  */
/* Menu Toggle Events */
header.addEventListener('click', (event) => {
    /* Toggle Mobile Menu */
    if ( event.target.id == 'toggleMobileMenuButton') {
        toggleClass(mobileMenu, "menu-open");
    };
});

document.addEventListener("click", (event) => {
    /* Click-out Event */
    if (!header.contains(event.target) && classArray(mobileMenu).includes("menu-open")) {
        console.log("click off");
        removeClass(mobileMenu, "menu-open");
    };
});

