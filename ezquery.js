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

  DOMNodeCollection.prototype.each = function(callback, caller) {
    this.elements.forEach(function(el) {
      callback.call(caller, el);
    });
  };

  DOMNodeCollection.prototype.html = function(innerHTML) {
    if (typeof innerHTML === 'undefined') {
      return this.elements[0].innerHTML;
    } else {
      this.each(function(el) {
        el.innerHTML = innerHTML;
      });
    }
  };

  DOMNodeCollection.prototype.empty = function() {
    this.each(function(el) {
      el.innerHTML = '';
    });
  };

  DOMNodeCollection.prototype.append = function(arg) {
    var that = this;

    function appendToAll(value) {
      that.each(function(el) {
        el.innerHTML = el.innerHTML + value;
      });
    }

    if (arg instanceof DOMNodeCollection) {
      arg.each(function(el) {
        appendToAll(el.outerHTML);
      });
    } else if (arg instanceof HTMLElement) {
      appendToAll(arg.outerHTML);
    } else {
      appendToAll(arg.toString());
    }
  };

  DOMNodeCollection.prototype.attr = function(attributeName, value) {
    if (typeof value === 'undefined' && this.elements.length) {
      return this.elements[0].getAttribute(attributeName);
    } else {
      this.each(function(el) {
        el.setAttribute(attributeName, value);
      });
    }
  };
})(this);
