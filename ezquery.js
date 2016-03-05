(function(root) {
  root.$ez = function(selector) {
    var nodeList = document.querySelectorAll(selector);
    var elements = Array.prototype.slice.call(nodeList);

    return new DOMNodeCollection(elements);
  };

  function DOMNodeCollection(elements) {
    this.elements = elements;
  }
})(this);
