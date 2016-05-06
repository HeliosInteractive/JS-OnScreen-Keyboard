"use strict";

function Keyboard(){

  this.focusedEl = null;

  // We would like to pipe all keyboard events through one handler
  var handleKeyboardEvents = function (e) {
    e.preventDefault();
    // TODO Check to make sure it's a key that's pressed

    // Pipe key's data to an object
    var keyInfo = Object.assign({}, e.target.dataset);

    // Update focused element if there is one
    if (this.focusedEl !== null) {
      // Append key's symbol to wherever the input caret is at
      var pos = this.focusedEl.selectionStart;
      var text = this.focusedEl.value;
      this.focusedEl.value = text.substring(0, pos) + keyInfo.symbol + text.substring(pos);
      this.focusedEl.setSelectionRange(pos+1, pos+1);

      // TODO make work with selected test too
    }
    // Invoke the hook with key's data if there's one

  }.bind(this);

  function createKeyboardElement() {
    var container = document.createElement("div");
    container.classList.add("keyboard-container");
    for (var i = 0; i < 3; i++) {
      var keyEl = document.createElement("div");
      keyEl.classList.add("key");
      keyEl.innerHTML = i;
      // TODO Add optional info that the keys should provide here
      keyEl.dataset.symbol = i;
      // IDEA For special func keys, dataset could include function ID. Or just a boolean for special

      container.appendChild(keyEl);
    }
    return container;
  };

  // Generate keyboard HTML, bind events, insert them to given element
  this.placeIn = function (el) {
    var keyboardEl = createKeyboardElement();
    // bind events
    keyboardEl.addEventListener("mousedown", handleKeyboardEvents);
    keyboardEl.addEventListener("touchstart", handleKeyboardEvents);
    // Append keys to el
    el.appendChild(keyboardEl);
  }

  // Control which el is being updated
  this.focus = function (el) {
    console.log("focus", el);
    this.focusedEl = el;
  };
  this.blur = function () {
    this.focusedEl = null;
  };

  // Unbind the events, destroy the elements
  this.destroy = function () {
    console.log("DESTRUCTION");
  };
};
