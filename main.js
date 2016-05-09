"use strict";

console.log("TEEEEEXT");
var keyboard = new Keyboard("basic");
var hostEL = document.querySelector(".keyboard-host");
var inputEl = document.querySelector(".input-name");

// Generate keyboard HTML, bind events, insert them to given element
keyboard.placeIn(hostEL);
// Set event handler for all keyboard events
keyboard.callback = function handleKeyboardEvents(e) {
  console.log(e);
};
// Make keyboard's events update input el's content
keyboard.focus(inputEl);

// keyboard.destroy();
