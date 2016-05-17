"use strict";

var keyboard = new Keyboard("basic");
var hostEL = document.querySelector(".keyboard-host");
var inputEl = document.querySelector(".input-name");

// Generate keyboard HTML, bind events, insert them to given element
keyboard.placeIn(hostEL);

// TODO Keyboard should allow hooking functions to execute for special keys
// e.g.
// keyboard.customFunc["tab"] = function switchInput(){
// ...code
// }

// Make keyboard's events update input el's content
keyboard.focus(inputEl);

// keyboard.destroy();
