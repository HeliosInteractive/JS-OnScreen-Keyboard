if( !exports ) var exports = {};
(function(exports, global){
  "use strict";

  function splice(str, index, count, add) {
    return str.slice(0, index) + (add || "") + str.slice(index + count);
  }

  function Element(Keyboard, el){

    this.Keyboard = Keyboard;
    this.listeners = {keypresskeypress:[]};
    this.maxlength = el.getAttribute('maxlength');

    el.layout = global.Keyboard.layout[el.type] ? el.type : '_default';

    function dispatchEvent(event, keyInfo){

      var event = new KeyboardEvent(event,{
        code: 'Key' + keyInfo.symbol,
        keyCode : keyInfo.symbol.charCodeAt(0),
        which : keyInfo.symbol.charCodeAt(0),
        altKey : false,
        ctrlKey : false,
        shiftKey : false,
        metaKey : false
      });
      event.key = keyInfo.symbol;    // just enter the char you want to send
      el.dispatchEvent(event);
    }

    this.onEvent = function(keyInfo){
      dispatchEvent('keydown', keyInfo);
    };

    this.keydownfunc = function(e){

      e.preventDefault();
      console.log('keydown', e);
      if( this.value.length >= this.maxlength ){
        return;
      }
      var pos = el.selectionStart + 1;
      this.value = splice(this.value, el.selectionStart,0,e.key || String.fromCharCode(e.keyCode));
      this.setSelectionRange(pos, pos); // reset the position after the splice
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
    this.listeners = {key:[],special:[]};
    this.keyboardEl = null;
    this.layout = null;
    this.keyboardEl = document.createElement("div");
    this.keyboardEl.classList.add("keyboard-container");
    this.keyboardEl.addEventListener("mousedown", handleKeyboardEvents.bind(this));
    this.keyboardEl.addEventListener("touchstart", handleKeyboardEvents.bind(this));

    // Generate keyboard HTML, bind events, insert them to given element
    this.show = function (layout) {

      if (!global.Keyboard.layout[layout]) throw new Error("keyboard initiation: Missing layout: " + layout);
      if( self.layout && layout === self.layout && this.active){
        return;
      }
      this.active = true;

      self.layout = layout;
      this.keyboardEl.innerHTML = "";

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

      holder.appendChild(self.keyboardEl);
    };

    this.hide = function(){
      self.active = false;
      setTimeout(function(){
        if( self.active ) return;
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

    /*if( keyInfo.special){
      return self.listeners.special.forEach(function(action){
        action(keyInfo);
      });
    }

    if( !keyInfo.symbol ) return;*/

    var keys;
    if (keyInfo.symbol.length === 1) {
      keys = [keyInfo.symbol];
    }
    else {
      keys = keyInfo.symbol.split('');
    }

    keys.forEach(function(key){
      self.listeners['key'].forEach(function(action){
        action(keyInfo, key);
      });
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
        {"symbol": ".com"},
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
        {"symbol": ".net"},
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
