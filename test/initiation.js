describe("Initiation", function () {

  it("new Keyboard('basic') creates an object and remembers layout name", function () {
    var keyboard = new Keyboard("basic");
    keyboard.should.be.an.Object;
  });
  it("new Keyboard('nonExistentLayout') throws error ", function () {
      (function(){
        var keyboard = new Keyboard("nonExistentLayout");
      }).should.throw();
  });
  it("new Keyboard() throws Error", function () {
    (function(){
      var keyboard = new Keyboard();
    }).should.throw();
  });

});
