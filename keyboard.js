"use strict";
function Keyboard(){

  // We would liek to pipe all keyboard events through one handler
  function convergeKeyboardEvents = function(){

  }

  // Generate keyboard HTML, bind events, insert them to given element
  this.placeIn = function (el) {
    console.log("attachTo", el);
  }
  // Make keyboard's events update input el's content
  this.focus = function (el) {
    console.log("focus", el);
  };
  // Unbind the events, destroy the elements
  this.destroy = function () {
    console.log("DESTRUCTION");
  };
};
