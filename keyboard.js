if( !exports ) var exports = {};
(function(exports, global){
  "use strict";


  function Element(Keyboard, el){

    var self = this;

    this.el = el;
    this.Keyboard = Keyboard;
    this.listeners = {keypresskeypress:[]};
    el.layout = global.Keyboard.layout[el.type] ? el.type : '_default';
    el.addEventListener('focus', this.focus.bind(this));
    el.addEventListener('blur', this.blur.bind(this));

    this.maxlength = el.getAttribute('maxlength');
    if( !this.maxlength ) this.maxlength = 9999999999;

    el.onKeyPress = function(keyInfo, e){
      if( this.value.length >= this.maxlength ){
        return;
      }
      this.value += e;
    };
    el.onBackspace = function(){
      this.value = this.value.substr(0, this.value.length-1);
    };
  }

  Element.prototype.focus = function(e){
    var self = this;
    self.Keyboard.show(e.target.layout);
    this.Keyboard.on('key', this.el.onKeyPress.bind(this.el));
    this.Keyboard.on('backspace', this.el.onBackspace.bind(this.el));
  };
  Element.prototype.blur = function(e){
    this.Keyboard.hide(e.target.layout);
    this.Keyboard.off('key', this.el.onKeyPress.bind(this.el));
    this.Keyboard.off('backspace', this.el.onBackspace.bind(this.el));
  };

  function Keyboard(inputs, holder){

    var self = this;

    Array.prototype.slice.call(inputs, 0).forEach(function(input){
      input.setAttribute('data-keyboard', new Element(self, input));
    });

    this.active = false;
    this.listeners = {key:[],backspace:[]};
    this.keyboardEl = null;
    this.layout = null;
    this.keyboardEl = document.createElement("div");
    this.keyboardEl.classList.add("keyboard-container");
    this.keyboardEl.addEventListener("mousedown", handleKeyboardEvents.bind(this));
    this.keyboardEl.addEventListener("touchstart", handleKeyboardEvents.bind(this));

    this.setLayout = function (layoutName) {
      if (!global.Keyboard.layout[layoutName]) throw new Error("keyboard initiation: Missing layout: " + layoutName);
      self.layout = layoutName;
    };

    // Generate keyboard HTML, bind events, insert them to given element
    this.show = function (layout) {

      if (!global.Keyboard.layout[layout]) throw new Error("keyboard initiation: Missing layout: " + layout);
      if( self.layout && layout === self.layout && this.active){
        return;
      }
      this.active = true;
      var update = false;

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
      this.listeners[evt].push(action);
    };
    this.off = function(evt, action){
      this.listeners[evt] = this.listeners[evt].filter(function(listener){
        return action.toString() !== listener.toString();
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

    if( keyInfo.backspace){
      return self.listeners['backspace'].forEach(function(action){
        action(keyInfo);
      });
    }

    if( !keyInfo.symbol ) return;

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
        {"label": "\u21E6", "backspace":true}
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
