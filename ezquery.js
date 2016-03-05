(function(root) {
  root.$ez = function(arg) {
    var elements, nodeList;

    if (arg instanceof HTMLElement) {
      elements = [arg];
    } else {
      nodeList = document.querySelectorAll(arg);
      elements = Array.prototype.slice.call(nodeList);
    }

    return new DOMNodeCollection(elements);
  };

  function DOMNodeCollection(elements) {
    this.elements = elements;
  }

  DOMNodeCollection.prototype.html = function(innerHTML) {
    if (typeof innerHTML === 'undefined') {
      return this.elements[0].innerHTML;
    } else {
      this.elements.forEach(function(el) {
        el.innerHTML = innerHTML;
      });
    }
  };
})(this);
