describe("DOM Tests", function () {
    var el = document.createElement("div");
    el.id = "myDiv";
    el.innerHTML = "Hi there!";
    el.style.background = "#ccc";
    document.body.appendChild(el);

    var myEl = document.getElementById('myDiv');
    it("is in the DOM", function () {
        myEl.should.not.eql(null);
    });

    it("is a child of the body", function () {
        myEl.parentElement.should.eql(document.body);
    });

    it("has the right text", function () {
        myEl.innerHTML.should.eql("Hi there!");
    });

    it("has the right background", function () {
        myEl.style.background.should.eql("rgb(204, 204, 204)");
    });
});
