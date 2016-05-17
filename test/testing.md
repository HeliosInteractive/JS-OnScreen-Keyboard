# Testing

## Tools

#### Mocha.js
Test runner

#### Should.js
Assertion for tests

#### Blanket.js
Code Coverage - How much code was tested

#### PhantomJS
Headless browser for DOM manipulation and interaction simulation

## Roadmap

- [ ] Test for each public function and how people would use them
  - [x] `new Keyboard();`
  - [ ] `placeIn();`
  - [ ] `destroy();`
  - [ ] `focus();`
  - [ ] `blur();`
- [ ] Test for every possible interactions
  - [ ] Fire every button on the keyboard and make sure they all go through handleKeyboardEvents
  - [ ] When there is an element focused, all the symbol keys update it with its symbol(s)
