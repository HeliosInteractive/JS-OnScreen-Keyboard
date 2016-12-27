# JS OnScreen Keyboard

## How to use this

```
var inputs = document.forms["demo"].getElementsByTagName("input");
var keyboardHost = document.querySelector('.keyboard-host');
var keyboard = new window.Keyboard(inputs, keyboardHost);
```

Check out demo.html for example.

## Goals

- Minimal dependency
- Works outta the box with vanilla javascript, can be integrated easily to frameworks too
  - Or at least our Backbone apps
- Has the same behavior click v.s. touch
- Allows control over its show/hide, create/destroy
- Allows customization
  - layout
  - style / skin
  - special keys with custom functionalities

## Dev Roadmap

- [x] Generate Keyboard HTML & insert them to a designated element
  - [x] Make it work w/ 3 buttons first
- [x] Whenever a key is clicked or touched, it would fire an event that keyboard handles
- [x] Converge all events to a single handler
- [x] Keyboard can keep track of which element it should update
- [x] When there is an element the keyboard's focusing on, pressing keys inserts value to it
- [x] Value inserting works just like actual keyboard, takes caret place and selection into consideration
- [x] Destroy function to unbind and destroy html
- [x] Layouts are defined by config json file and can be swapped
- [x] Keys may insert a different character than its label
- [ ] Common functionality keys
  - [x] backspace
  - [ ] tab
- [x] A system to easily attach new func keys
  - [x] 'func' property in layout files used to differentiate b/c keys
  - [x] public function to attach functions to run for keys w/ diff func
  - [x] Keys can have same func but different additional info too, and handlers have access to that
- [ ] Bug: When input's content is longer than input box's width, it should move the cursor to show the caret
  - Easy way to do this is via setting `focusedEl.scrollLeft` to a high number. This would however always jump to the end of input no matter where the caret's at.
  - To make this intelligent we need some method of calculating caret's pixel location?

- [x] Generated keys have a structure that allows easy style changing via CSS

- [ ] Platform testing
- [ ] Click, Touch, Chrome's touch simulation, and FastClick.js driven touch event should all behave the same
- [ ] Getters to make many type checkings easier?
  - [x] `setLayout`
  - [ ] `focusedEl`?
  - [ ] `keyboardEl`?
- [ ] Support more browsers than just `Chrome`
