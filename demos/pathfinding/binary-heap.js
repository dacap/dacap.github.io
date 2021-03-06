// Generated by CoffeeScript 1.3.3
// Author: Bernerd Schaefer
// License: BSD
(function(window, undefined) {
  var BinaryHeap,
    __slice = [].slice;

  window.BinaryHeap = BinaryHeap = (function() {

    function BinaryHeap(compare) {
      this.compare = compare != null ? compare : function(x, y) {
        return x < y;
      };
      this.list = [];
    }

    BinaryHeap.prototype.push = function() {
      var item, items, _i, _len, _results;
      items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _results = [];
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        this.list.push(item);
        _results.push(this.swim(this.list.length - 1));
      }
      return _results;
    };

    BinaryHeap.prototype.peek = function() {
      return this.list[0];
    };

    BinaryHeap.prototype.pop = function() {
      var item;
      item = this.peek();
      this.removeAt(0);
      return item;
    };

    BinaryHeap.prototype.remove = function(item) {
      var index;
      if (!((index = this.list.indexOf(item)) < 0)) {
        return this.removeAt(index);
      }
    };

    BinaryHeap.prototype.removeAt = function(index) {
      var last;
      last = this.list.pop();
      if (this.list.length > 0) {
        this.list[index] = last;
        return this.sink(index);
      }
    };

    BinaryHeap.prototype.swap = function(a, b) {
      var _ref;
      return _ref = [this.list[b], this.list[a]], this.list[a] = _ref[0], this.list[b] = _ref[1], _ref;
    };

    BinaryHeap.prototype.sink = function(index) {
      var left, length, right, swap_index, _ref;
      length = this.list.length;
      _ref = [index * 2 + 1, index * 2 + 2], left = _ref[0], right = _ref[1];
      if (left >= length) {
        return;
      }
      swap_index = left;
      if (right < length && this.compare(this.list[right], this.list[left])) {
        swap_index = right;
      }
      if (this.compare(this.list[swap_index], this.list[index])) {
        this.swap(index, swap_index);
        return this.sink(swap_index);
      }
    };

    BinaryHeap.prototype.swim = function(index) {
      var parent;
      if (index === 0) {
        return;
      }
      parent = Math.floor((index - 1) / 2);
      if (this.compare(this.list[index], this.list[parent])) {
        this.swap(parent, index);
        return this.swim(parent);
      }
    };

    return BinaryHeap;

  })();

})(window);
