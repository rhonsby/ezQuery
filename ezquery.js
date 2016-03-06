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

    return this;
  };

  DOMNodeCollection.prototype.html = function(innerHTML) {
    if (typeof innerHTML === 'undefined' && this.elements.length) {
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

    return this;
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

    return this;
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

  DOMNodeCollection.prototype.addClass = function() {
    var classes = Array.prototype.slice.call(arguments);

    classes.forEach(function(className) {
      this.each(function(el) {
        el.classList.add(className);
      });
    }, this);

    return this;
  };

  DOMNodeCollection.prototype.removeClass = function(className) {
    var classes = Array.prototype.slice.call(arguments);

    classes.forEach(function(className) {
      this.each(function(el) {
        el.classList.remove(className);
      });
    }, this);

    return this;
  };
})(this);
