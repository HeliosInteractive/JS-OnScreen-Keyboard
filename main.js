"use strict";

console.log("TEEEEEXT");
var keyboard = new Keyboard();
var containerEl = document.querySelector(".keyboard-container");
var inputEl = document.querySelector(".input-name");

// Generate keyboard HTML, bind events, insert them to given element
keyboard.placeIn(containerEl);
// Set event handler for all keyboard events
keyboard.callback = function handleKeyboardEvents(e) {
  console.log(e);
};
// Make keyboard's events update input el's content
keyboard.focus(inputEl);

// keyboard.destroy();
