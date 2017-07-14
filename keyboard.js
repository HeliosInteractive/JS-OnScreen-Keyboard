if( !exports ) var exports = {};
(function(exports, global){
  "use strict";

  function splice(str, index, count, add) {
    return str.slice(0, index) + (add || "") + str.slice(index + count);
  }

  function checkSelectionSupport(type){
    if (["text", "search", "URL", "tel", "password"].indexOf(type) == -1 ) return false;
    return true;
  }

  function dispatchKeyboardOpenEvent(){
    document.dispatchEvent(new CustomEvent('keyboard-open'));
  }

  function dispatchKeyboardCloseEvent(){
    document.dispatchEvent(new CustomEvent('keyboard-close'));
  }

  function Element(Keyboard, el){

    this.Keyboard = Keyboard;

    el.layout = global.Keyboard.layout[el.type] ? el.type : '_default';

    function dispatchEvent(event, keyInfo){

      var event = new KeyboardEvent(event,{
        key: keyInfo.symbol,
        code: 'Key' + keyInfo.symbol,
        keyCode : keyInfo.symbol.charCodeAt(0),
        which : keyInfo.symbol.charCodeAt(0),
        altKey : false,
        ctrlKey : false,
        shiftKey : false,
        metaKey : false
      });
      event.virtual = true;
      el.dispatchEvent(event);
    }

    this.onEvent = function(keyInfo){
      dispatchEvent('keydown', keyInfo);
      dispatchEvent('keypress', keyInfo);
      dispatchEvent('keyup', keyInfo);
    };

    this.keydownfunc = function(e){

      // If keydown is authentic, skip our internal update and let the default play out
      if (!e.virtual) return;
      e.preventDefault();

      var selectionSupported = checkSelectionSupport(this.type);

      if (e.key == "backspace") {
        if ( !selectionSupported ) {
          this.value = this.value.slice(0, -1);
        } else {
          var pos = el.selectionStart;
          var offset = el.selectionEnd-el.selectionStart? 0:1;
          this.value = this.value.substring(0, el.selectionStart-offset) + this.value.slice(el.selectionEnd);
          this.setSelectionRange(pos-offset, pos-offset);
        }
        return;
      }

      if( this.value.length >= this.maxLength && this.maxLength != -1 ){
        return;
      }
      var update = e.key || String.fromCharCode(e.keyCode);

      // Support an input case that will capitalize letters as needed
      if(( e.target.dataset.case === 'sentence' && (this.value.length === 0 || this.value.slice(-1) === "." || this.value.slice(-2) === ". " ))
        || ( e.target.dataset.case === 'capitalize' && this.value.slice(-1) === " " ))
      {
        update = update.toUpperCase();
      }

      // TODO Mimic selection for input elements that don't support selection api as well
      // IDEA: selection-polyfill? get caret's pixel location instead?
      if ( !selectionSupported ) {
        this.value += update;
      } else {
        var pos = el.selectionStart + update.length;
        this.value = splice(
          this.value,
          el.selectionStart,
          el.selectionEnd-el.selectionStart,
          update
        );
        this.setSelectionRange(pos, pos); // reset the position after the splice
      }
      // TODO Calculate scroll amount based on caret position
      this.scrollLeft = this.scrollWidth;
    };

    el.addEventListener('focus', this.focus.bind(this));
    el.addEventListener('blur', this.blur.bind(this));
    el.addEventListener('keydown', this.keydownfunc);
  }

  Element.prototype.focus = function(e){
    this.Keyboard.show(e.target.layout);
    this.Keyboard.on('key', this.onEvent);
  };
  Element.prototype.blur = function(e){
    this.Keyboard.hide(e.target.layout);
    this.Keyboard.off('key', this.onEvent);
  };

  function Keyboard(inputs, holder){

    var self = this;

    Array.prototype.slice.call(inputs, 0).forEach(function(input){
      input.Keyboard = new Element(self, input);
    });

    this.active = false;
    this.listeners = {key:[]};
    this.keyboardEl = null;
    this.layout = null;
    this.keyboardEl = document.createElement("div");
    this.keyboardEl.classList.add("keyboard-container");
    this.keyboardEl.addEventListener("mousedown", handleKeyboardEvents.bind(this));
    // TODO - find a way to enable this touchstart event again.
    // It prevents the :active state from being triggered on keys
    // this.keyboardEl.addEventListener("touchstart", handleKeyboardEvents.bind(this));

    // Generate keyboard HTML, bind events, insert them to given element
    this.show = function (layout) {

      if (!global.Keyboard.layout[layout]) throw new Error("keyboard initiation: Missing layout: " + layout);
      if( self.layout && layout === self.layout && this.active){
        return;
      }
      this.active = true;

      self.layout = layout;
      this.keyboardEl.innerHTML = "";
      this.keyboardEl.classList.remove('keyboard-container-hidden');

      var closeButton = document.createElement("span");
      closeButton.classList.add('keyboard-close-button');
      closeButton.innerHTML = '✖';
      this.keyboardEl.appendChild(closeButton);
      closeButton.onclick = function() {
        document.activeElement.blur()
      }.bind(this);
      closeButton.ontouchstart = function() {
        document.activeElement.blur()
      }.bind(this);

      function foreachLayout(row, rowIndex, layout) {

        var rowEl = document.createElement("div");
        rowEl.classList.add("keyboard-row");
        rowEl.classList.add("keyboard-row--" + rowIndex);

        function foreachRow(key, keyIndex, row) {
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

      global.Keyboard.layout[self.layout].forEach(foreachLayout);
      // Append keys to el

      dispatchKeyboardOpenEvent()
      holder.appendChild(self.keyboardEl);
    };

    this.hide = function(){
      self.active = false;
      dispatchKeyboardCloseEvent()
      setTimeout(function(){
        if( self.active ) return;
        self.keyboardEl.classList.add("keyboard-container-hidden");
        self.keyboardEl.innerHTML = "";
      },25);
    }

    this.on = function(evt, action){
      if( !this.listeners[evt] ){
        this.listeners[evt] = [];
      }
      this.listeners[evt].push(action);
    };
    this.off = function(evt, action){
      if( !this.listeners[evt] ) return;
      this.listeners[evt] = this.listeners[evt].filter(function(listener){
        return action.toString() !== listener.toString();
      });
    };

    /**
     * Add input(s) after the fact
     * @param inputs
     */
    this.add = function(inputs){

      if(!Array.isArray(inputs))
        inputs = [inputs];

      Array.prototype.slice.call(inputs, 0).forEach(function(input){
        input.Keyboard = new Element(self, input);
      });
    };

  };


  // We would like to pipe all keyboard events through one handler
  var handleKeyboardEvents = function (e) {

    var self = this;
    e.preventDefault();
    // Check to make sure it's a key that's pressed
    if (!e.target.classList.contains("keyboard-key")) return;
    var keyInfo = e.target.dataset;

    self.listeners['key'].forEach(function(action){
      action(keyInfo);
    });

  };

  global.Keyboard = Keyboard;
  global.Keyboard.layout = {
    _default: [
      [
        {"symbol": "Q"},
        {"symbol": "W"},
        {"symbol": "E"},
        {"symbol": "R"},
        {"symbol": "T"},
        {"symbol": "Y"},
        {"symbol": "U"},
        {"symbol": "I"},
        {"symbol": "O"},
        {"symbol": "P"},
        {"label": ".com", "symbol": ".COM"},
        {"symbol": "7"},
        {"symbol": "8"},
        {"symbol": "9"},
        {"label": "\u21E6", "symbol":"backspace"}
      ],
      [
        // {"label": "tab", "func": "tab"},
        {"symbol": "A"},
        {"symbol": "S"},
        {"symbol": "D"},
        {"symbol": "F"},
        {"symbol": "G"},
        {"symbol": "H"},
        {"symbol": "J"},
        {"symbol": "K"},
        {"symbol": "L"},
        {"symbol": "@"},
        {"label": ".net", "symbol": ".NET"},
        {"symbol": "4"},
        {"symbol": "5"},
        {"symbol": "6"}
      ],
      [
        {"symbol": "Z"},
        {"symbol": "X"},
        {"symbol": "C"},
        {"symbol": "V"},
        {"symbol": "B"},
        {"symbol": "N"},
        {"symbol": "M"},
        {"symbol": "."},
        {"symbol": "_"},
        {"symbol": "-"},
        {"symbol": " ", "label": "space"},
        {"symbol": "0"},
        {"symbol": "1"},
        {"symbol": "2"},
        {"symbol": "3"}
      ]
    ]
  };
})(exports || {}, window);
