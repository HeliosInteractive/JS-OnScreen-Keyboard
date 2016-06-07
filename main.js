"use strict";



var inputs = document.forms["demo"].getElementsByTagName("input");

var keyboardHost = document.querySelector('.keyboard-host');
var keyboard = new window.Keyboard(inputs, keyboardHost);


/*
inputs[0].onKeyPress = function(info, key){
  console.log('custom keypress');
  // set your own interceptor here
  this.value += key;
  //console.log('pressed', info, key, this)
}*/



