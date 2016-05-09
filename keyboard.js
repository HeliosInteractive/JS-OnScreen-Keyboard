"use strict";

function Keyboard(layoutName){

  this.activeLayoutName = layoutName;

  this.focusedEl = null;
  this.keyboardEl = null;

  // We would like to pipe all keyboard events through one handler
  var handleKeyboardEvents = function (e) {
    e.preventDefault();
    // Check to make sure it's a key that's pressed
    if (!e.target.classList.contains("keyboard-key")) return;
    // Pipe key's data to an object
    var keyInfo = Object.assign({}, e.target.dataset);

    // Update focused element if there is one
    if (this.focusedEl !== null) {
      var start = this.focusedEl.selectionStart;
      var end = this.focusedEl.selectionEnd;
      var text = this.focusedEl.value;
      this.focusedEl.value = text.substring(0, start) + keyInfo.symbol + text.substring(end);
      var newCaretPosition = this.focusedEl.value.length - (text.length - end);
      this.focusedEl.setSelectionRange(newCaretPosition, newCaretPosition);
    }

  }.bind(this);

  // Generate keyboard HTML, bind events, insert them to given element
  this.placeIn = function (el) {
    if (!Keyboard.layout[this.activeLayoutName]) throw new Error("Keyboard.placeIn(): Missing layout.");
    // Create container
    this.keyboardEl = document.createElement("div");
    this.keyboardEl.classList.add("keyboard-container");
    // Create elements based off layout
    // TODO There's a lot of indentation here.
    Keyboard.layout[this.activeLayoutName].forEach(function(row, rowIndex, layout){
      var rowEl = document.createElement("div");
      rowEl.classList.add("keyboard-row");
      rowEl.classList.add("keyboard-row--" + rowIndex);
      row.forEach(function(key, keyIndex, row){
        var keyEl = document.createElement("div");
        keyEl.classList.add("keyboard-key");
        keyEl.classList.add("keyboard-key--" + keyIndex);
        // Parse the layout configuration
        for (var dataName in key) {
          switch (dataName) {
            case "symbol":
              if (!key.label) keyEl.innerHTML = key[dataName];
              keyEl.dataset.symbol = key[dataName];
              break;
            case "label":
              keyEl.innerHTML = key[dataName];
              break;
            default:
              keyEl.dataset[dataName] = key[dataName];
          }
        }
        rowEl.appendChild(keyEl);
      });
      this.keyboardEl.appendChild(rowEl);
    }, this);

    // bind events
    this.keyboardEl.addEventListener("mousedown", handleKeyboardEvents);
    this.keyboardEl.addEventListener("touchstart", handleKeyboardEvents);
    // Append keys to el
    el.appendChild(this.keyboardEl);
  };

  // Control which el is being updated
  this.focus = function (el) {
    this.focusedEl = el;
  };
  this.blur = function () {
    this.focusedEl = null;
  };

  // Unbind the events, destroy the elements
  this.destroy = function () {
    if (this.keyboardEl === null) throw new Error("Keyboard.destroy() error: Keyboard HTML Elements aren't present");
    this.keyboardEl.removeEventListener("mousedown", handleKeyboardEvents);
    this.keyboardEl.removeEventListener("touchstart", handleKeyboardEvents);
    this.keyboardEl.remove();
    this.keyboardEl = null;
    this.blur();
  };
};

Keyboard.layout = {};
