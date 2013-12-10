// Generated by CoffeeScript 1.6.1

/* ============================================================
# bootstrap-tour.js v0.1
# http://pushly.github.com/bootstrap-tour/
# ==============================================================
# Copyright 2012 Push.ly
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
*/


(function() {

  (function($, window) {
    var Tour, document;
    document = window.document;
    Tour = (function() {

      function Tour(options) {
        var _this = this;
        this._options = $.extend({
          name: 'tour',
          labels: {
            end: 'End tour',
            next: 'Next &raquo;',
            prev: '&laquo; Prev'
          },
          keyboard: true,
          useLocalStorage: false,
          afterSetState: function(key, value) {},
          afterGetState: function(key, value) {},
          onStart: function(tour) {},
          onEnd: function(tour) {},
          onShow: function(tour) {},
          onHide: function(tour) {},
          onShown: function(tour) {}
        }, options);
        this._steps = [];
        this.setCurrentStep();
        this._onresize(function() {
          if (!_this.ended) {
            return _this.showStep(_this._current);
          }
        });
      }

      Tour.prototype.setState = function(key, value) {
        if (this._options.useLocalStorage) {
          window.localStorage.setItem("" + this._options.name + "_" + key, value);
        } else {
          $.cookie("" + this._options.name + "_" + key, value, {
            expires: 36500,
            path: '/'
          });
        }
        return this._options.afterSetState(key, value);
      };

      Tour.prototype.getState = function(key) {
        var value;
        if (this._options.useLocalStorage) {
          value = window.localStorage.getItem("" + this._options.name + "_" + key);
        } else {
          value = $.cookie("" + this._options.name + "_" + key);
        }
        if (value === void 0 || value === "null") {
          value = null;
        }
        this._options.afterGetState(key, value);
        return value;
      };

      Tour.prototype.addStep = function(step) {
        return this._steps.push(step);
      };

      Tour.prototype.getStep = function(i) {
        if (this._steps[i] != null) {
          return $.extend({
            path: "",
            placement: "right",
            title: "",
            content: "",
            next: i === this._steps.length - 1 ? -1 : i + 1,
            prev: i - 1,
            animation: true,
            onShow: this._options.onShow,
            onHide: this._options.onHide,
            onShown: this._options.onShown
          }, this._steps[i]);
        }
      };

      Tour.prototype.start = function(force) {
        var _this = this;
        if (force == null) {
          force = false;
        }
        if (this.ended() && !force) {
          return;
        }
        $(document).off("click.bootstrap-tour", ".popover .next").on("click.bootstrap-tour", ".popover .next", function(e) {
          e.preventDefault();
          return _this.next();
        });
        $(document).off("click.bootstrap-tour", ".popover .prev").on("click.bootstrap-tour", ".popover .prev", function(e) {
          e.preventDefault();
          return _this.prev();
        });
        $(document).off("click.bootstrap-tour", ".popover .end").on("click.bootstrap-tour", ".popover .end", function(e) {
          e.preventDefault();
          return _this.end();
        });
        this._setupKeyboardNavigation();
        if (this._options.onStart != null) {
          this._options.onStart(this);
        }
        return this.showStep(this._current);
      };

      Tour.prototype.next = function() {
        this.hideStep(this._current);
        return this.showNextStep();
      };

      Tour.prototype.prev = function() {
        this.hideStep(this._current);
        return this.showPrevStep();
      };

      Tour.prototype.end = function() {
        this.hideStep(this._current);
        $(document).off("click.bootstrap-tour");
        $(document).off("keyup.bootstrap-tour");
        this.setState("end", "yes");
        if (this._options.onEnd != null) {
          return this._options.onEnd(this);
        }
      };

      Tour.prototype.ended = function() {
        return !!this.getState("end");
      };

      Tour.prototype.restart = function() {
        this.setState("current_step", null);
        this.setState("end", null);
        this.setCurrentStep(0);
        return this.start();
      };

      Tour.prototype.hideStep = function(i) {
        var step;
        step = this.getStep(i);
        if (step.onHide != null) {
          step.onHide(this);
        }
        return $(step.element).popover("hide");
      };

      Tour.prototype.showStep = function(i) {
        var path, step;
        step = this.getStep(i);
        if (!step) {
          return;
        }
        this.setCurrentStep(i);
        path = typeof step.path === "function" ? step.path.call() : step.path;
        if (this._redirect(path, document.location.pathname)) {
          document.location.href = path;
          return;
        }
        if (step.onShow != null) {
          step.onShow(this);
        }
        if (!((step.element != null) && $(step.element).length !== 0 && $(step.element).is(":visible"))) {
          this.showNextStep();
          return;
        }
        this._showPopover(step, i);
        if (step.onShown != null) {
          return step.onShown(this);
        }
      };

      Tour.prototype.setCurrentStep = function(value) {
        if (value != null) {
          this._current = value;
          return this.setState("current_step", value);
        } else {
          this._current = this.getState("current_step");
          if (this._current === null) {
            return this._current = 0;
          } else {
            return this._current = parseInt(this._current);
          }
        }
      };

      Tour.prototype.showNextStep = function() {
        var step;
        step = this.getStep(this._current);
        return this.showStep(step.next);
      };

      Tour.prototype.showPrevStep = function() {
        var step;
        step = this.getStep(this._current);
        return this.showStep(step.prev);
      };

      Tour.prototype._redirect = function(path, currentPath) {
        return (path != null) && path !== "" && path.replace(/\?.*$/, "").replace(/\/?$/, "") !== currentPath.replace(/\/?$/, "");
      };

      Tour.prototype._showPopover = function(step, i) {
        var content, nav, options, tip,
          _this = this;
        content = "" + step.content + "<br /><p>";
        options = $.extend({}, this._options);
        if (step.options) {
          $.extend(options, step.options);
        }
        if (step.reflex) {
          $(step.element).css("cursor", "pointer");
          $(step.element).on("click", function(e) {
            $(step.element).css("cursor", "auto");
            return _this.next();
          });
        }
        nav = [];
        if (step.prev >= 0) {
          nav.push("<a href='#" + step.prev + "' class='prev'>" + options.labels.prev + "</a>");
        }
        if (step.next >= 0) {
          nav.push("<a href='#" + step.next + "' class='next'>" + options.labels.next + "</a>");
        }
        content += nav.join(" | ");
        content += "<a href='#' class='pull-right end'>" + options.labels.end + "</a>";
        $(step.element).popover('destroy').popover({
          placement: step.placement,
          trigger: "manual",
          title: step.title,
          content: content,
          html: true,
          animation: step.animation,
          container: "body"
        }).popover("show");
        tip = $(step.element).data("popover").tip();
        this._reposition(tip, step);
        return this._scrollIntoView(tip);
      };

      Tour.prototype._reposition = function(tip, step) {
        var offsetBottom, offsetRight, original_left, original_offsetHeight, original_offsetWidth, original_top, tipOffset;
        original_offsetWidth = tip[0].offsetWidth;
        original_offsetHeight = tip[0].offsetHeight;
        tipOffset = tip.offset();
        original_left = tipOffset.left;
        original_top = tipOffset.top;
        offsetBottom = $(document).outerHeight() - tipOffset.top - $(tip).outerHeight();
        if (offsetBottom < 0) {
          tipOffset.top = tipOffset.top + offsetBottom;
        }
        offsetRight = $("html").outerWidth() - tipOffset.left - $(tip).outerWidth();
        if (offsetRight < 0) {
          tipOffset.left = tipOffset.left + offsetRight;
        }
        if (tipOffset.top < 0) {
          tipOffset.top = 0;
        }
        if (tipOffset.left < 0) {
          tipOffset.left = 0;
        }
        tip.offset(tipOffset);
        if (step.placement === 'bottom' || step.placement === 'top') {
          if (original_left !== tipOffset.left) {
            return this._replaceArrow(tip, (tipOffset.left - original_left) * 2, original_offsetWidth, 'left');
          }
        } else {
          if (original_top !== tipOffset.top) {
            return this._replaceArrow(tip, (tipOffset.top - original_top) * 2, original_offsetHeight, 'top');
          }
        }
      };

      Tour.prototype._replaceArrow = function(tip, delta, dimension, position) {
        return tip.find(".arrow").css(position, delta ? 50 * (1 - delta / dimension) + "%" : '');
      };

      Tour.prototype._scrollIntoView = function(tip) {
        var tipRect;
        tipRect = tip.get(0).getBoundingClientRect();
        if (!(tipRect.top >= 0 && tipRect.bottom < $(window).height() && tipRect.left >= 0 && tipRect.right < $(window).width())) {
          return tip.get(0).scrollIntoView(true);
        }
      };

      Tour.prototype._onresize = function(cb, timeout) {
        return $(window).resize(function() {
          clearTimeout(timeout);
          return timeout = setTimeout(cb, 100);
        });
      };

      Tour.prototype._setupKeyboardNavigation = function() {
        var _this = this;
        if (this._options.keyboard) {
          return $(document).on("keyup.bootstrap-tour", function(e) {
            if (!e.which) {
              return;
            }
            switch (e.which) {
              case 39:
                e.preventDefault();
                if (_this._current < _this._steps.length - 1) {
                  return _this.next();
                }
                break;
              case 37:
                e.preventDefault();
                if (_this._current > 0) {
                  return _this.prev();
                }
            }
          });
        }
      };

      return Tour;

    })();
    return window.Tour = Tour;
  })(jQuery, window);

}).call(this);