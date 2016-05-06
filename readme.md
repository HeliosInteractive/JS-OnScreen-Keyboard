# JS OnScreen Keyboard

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
- [ ] Value inserting works just like actual keyboard, takes caret place and selection into consideration
- [ ] Destroy function to unbind and destroy html
- [ ] Layouts are defined by config json file and can be swapped
- [ ] Some keys can have behaviors overriden and run custom functions instead
- [ ] Generated keys have a structure that allows easy style changing via CSS

- [ ] Platform testing
- [ ] Click, Touch, Chrome's touch simulation, and FastClick.js driven touch event should all behave the same
