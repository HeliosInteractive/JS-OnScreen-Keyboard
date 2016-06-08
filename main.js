"use strict";



var inputs = document.forms["demo"].getElementsByTagName("input");

// if you want to stop the internal listener from firing at all add a listener before binding to the keyboard
/*inputs[1].addEventListener('keydown', function(e){
  e.stopImmediatePropagation();
  console.log('stop propagation', e.key);
});*/

var keyboardHost = document.querySelector('.keyboard-host');
var keyboard = new window.Keyboard(inputs, keyboardHost);

// if you want to supplement the internal listener then bind after
/*inputs[0].addEventListener('keydown', function(e){
  console.log('supplement', e);
});*/
