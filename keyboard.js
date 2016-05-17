if( !exports ) var exports = {};
(function(exports, global){
  "use strict";

  function Keyboard(layoutName){

    if (!Keyboard.layout[layoutName]) throw new Error("keyboard initiation: Missing layout: " + layoutName);
    this.activeLayoutName = layoutName;

    this.focusedEl = null;
    this.keyboardEl = null;
  };
  // We would like to pipe all keyboard events through one handler
  var handleKeyboardEvents = function (e) {
    e.preventDefault();
    // Check to make sure it's a key that's pressed
    if (!e.target.classList.contains("keyboard-key") || !this.focusedEl) return;
    // Pipe key's data to an object
    var keyInfo = Object.assign({}, e.target.dataset);
    // Update focused element if there is one
    var oldStart = this.focusedEl.selectionStart;
    var oldEnd = this.focusedEl.selectionEnd;
    var oldText = this.focusedEl.value;
    this.focusedEl.value = oldText.substring(0, oldStart) + keyInfo.symbol + oldText.substring(oldEnd);
    var newCaretPosition = this.focusedEl.value.length - (oldText.length - oldEnd);
    this.focusedEl.setSelectionRange(newCaretPosition, newCaretPosition);
  };
  // Generate keyboard HTML, bind events, insert them to given element
  Keyboard.prototype.placeIn = function (el) {

    var self = this;
    if (!Keyboard.layout[self.activeLayoutName]) throw new Error("Keyboard.placeIn(): Missing layout: " + self.activeLayoutName);
    // Create container
    self.keyboardEl = document.createElement("div");
    self.keyboardEl.classList.add("keyboard-container");
    // Create elements based off layout

    function foreachLayout(row, rowIndex, layout){

      var rowEl = document.createElement("div");
      rowEl.classList.add("keyboard-row");
      rowEl.classList.add("keyboard-row--" + rowIndex);

      function foreachRow(key, keyIndex, row){
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
      }

      row.forEach(foreachRow);
      self.keyboardEl.appendChild(rowEl);
    }

    Keyboard.layout[self.activeLayoutName].forEach(foreachLayout);
    // bind events
    self.keyboardEl.addEventListener("mousedown", handleKeyboardEvents.bind(self));
    self.keyboardEl.addEventListener("touchstart", handleKeyboardEvents.bind(self));
    // Append keys to el
    el.appendChild(self.keyboardEl);
  };

  // Control which el is being updated
  Keyboard.prototype.focus = function (el) {
    this.focusedEl = el;
  };
  Keyboard.prototype.blur = function () {
    this.focusedEl = null;
  };
  // Unbind the events, destroy the elements
  Keyboard.prototype.destroy = function () {
    if (this.keyboardEl === null) throw new Error("Keyboard.destroy() error: Keyboard HTML Elements aren't present");
    this.keyboardEl.removeEventListener("mousedown", handleKeyboardEvents.bind(this));
    this.keyboardEl.removeEventListener("touchstart", handleKeyboardEvents.bind(this));
    this.keyboardEl.remove();
    this.keyboardEl = null;
    this.blur();
  };

  Keyboard.layout = {};
  global.Keyboard = Keyboard;
})(exports || {}, window);
