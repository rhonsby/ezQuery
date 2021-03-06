(function(root) {
  var onReadyFunctions = [];

  var tid = setInterval(function() {
    if (document.readyState === 'complete') {
      onReadyFunctions.forEach(function(func) {
        func();
      });

      clearInterval(tid);
    }
  }, 100);

  function createNewCollection(arg) {
    var elements, nodeList;

    if (arg instanceof HTMLElement) {
      elements = [arg];
    } else {
      nodeList = document.querySelectorAll(arg);
      elements = Array.prototype.slice.call(nodeList);
    }

    return new DOMNodeCollection(elements);
  }

  function callFunctionOnReady(func) {
    if (document.readyState === 'complete') {
      func();
    } else {
      onReadyFunctions.push(func);
    }
  }

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

  DOMNodeCollection.prototype.children = function() {
    var childNodes = [];
    var children;

    this.each(function(el) {
      children = Array.prototype.slice.call(el.children);
      children.forEach(function(child) {
        childNodes.push(child);
      });
    });

    return new DOMNodeCollection(childNodes);
  };

  DOMNodeCollection.prototype.parent = function(selector) {
    var parentElements = [];
    var parentElement;
    selector = selector || '*';

    this.each(function(el) {
      parentElement = el.parentElement;

      if (parentElement && parentElement.matches(selector)) {
        parentElements.push(parentElement);
      }
    });

    window.els = parentElements;

    return new DOMNodeCollection(parentElements);
  };

  DOMNodeCollection.prototype.find = function(selector) {
    var elements;
    var matchingElements = [];

    if (selector) {
      this.each(function(el) {
        var elements = el.querySelectorAll(selector);
        elements = Array.prototype.slice.call(elements);

        elements.forEach(function(matchingEl) {
          matchingElements.push(matchingEl);
        });;
      });
    }

    return new DOMNodeCollection(matchingElements);
  };

  DOMNodeCollection.prototype.remove = function(selector) {
    if (selector) {
      this.each(function(el) {
        if (el.matches(selector)) {
          el.remove();
        }
      });
    } else {
      this.each(function(el) {
        el.remove();
      });
    }

    return this;
  };

  DOMNodeCollection.prototype.on = function(type, callback) {
    this.each(function(el) {
      el.addEventListener(type, callback);
    });

    return this;
  };

  var $ez = root.$ez = function(arg) {
    if (arg instanceof Function) {
      callFunctionOnReady(arg);
    } else {
      return createNewCollection(arg);
    }
  };

  $ez.extend = function() {
    var objects = Array.prototype.slice.call(arguments);
    var extendedObj, otherObj;

    if (!objects.length) {
      return
    } else {
       extendedObj = objects[0];

      for (var i = 1; i < objects.length; i++) {
        otherObj = objects[i];
        for (var prop in otherObj) {
          if (otherObj.hasOwnProperty(prop)) {
            extendedObj[prop] = otherObj[prop];
          }
        }
      }

      return extendedObj;
    }
  };

  $ez.ajax = function(options) {
    var defaults = {
      type: 'GET',
      success: function() {},
      error: function() {},
      complete: function() {},
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
    };
    options = this.extend(defaults, options);

    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
      if (httpRequest.readyState === XMLHttpRequest.DONE) {
        var response = JSON.parse(httpRequest.responseText);

        if (httpRequest.status === 200) {
          options.success(response);
        } else {
          options.error(response);
        }

        options.complete();
      }
    };

    httpRequest.open(options.type, options.url);

    if (options.type === 'POST') {
      httpRequest.setRequestHeader('Content-Type', options.contentType);
    }

    httpRequest.send(options.data);
  };
})(this);
