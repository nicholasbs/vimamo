(function() {
  var defaultOptions, deselect, getPrimaryHostname, hostname, options, select, sites;
  sites = {
    "www.facebook.com": {
      selector: ".uiStreamStory",
      offsetBottom: 30,
      offsetTop: -10,
      selectedClass: "vimamo-fb-selected:visible",
      searchSelector: ".uiSearchInput input[type=text]",
      onEnter: function() {
        return window.location = $(".vimamo-fb-selected .actorName a").attr("href");
      }
    },
    "tumblr.com": {
      selector: ".post",
      offsetBottom: 10,
      offsetTop: -10,
      onEnter: function() {
        return window.location = $(".vimamo-selected .seeMore").attr("href");
      }
    },
    "news.ycombinator.com": {
      selectedClass: "vimamo-hn-selected",
      searchSelector: "input[name=q]",
      getFirst: function() {
        return $("table tr table tr td.title").first().closest("tr");
      },
      getNext: function(current) {
        var next;
        next = current.next("tr");
        while (next.length > 0 && next.find("td").length < 1) {
          next = next.next("tr");
        }
        return next.first();
      },
      getPrev: function(current) {
        var prev;
        prev = current.prev("tr");
        while (prev.length > 0 && prev.find("td").length < 1) {
          prev = prev.prev("tr");
        }
        return prev.first();
      },
      onEnter: function() {
        var selected;
        selected = $(".vimamo-hn-selected");
        if (selected.find("td.subtext").length > 0) {
          return window.location = selected.find("td a:last-child").attr("href");
        } else {
          return window.location = selected.find("td:last-child a").attr("href");
        }
      }
    }
  };
  defaultOptions = {
    selectedClass: "vimamo-selected",
    offsetBottom: 0,
    offsetTop: 0,
    getNext: function(current) {
      return current.nextAll(options.selector).first();
    },
    getPrev: function(current) {
      return current.prevAll(options.selector).first();
    },
    getFirst: function() {
      return $(options.selector).first();
    }
  };
  select = function(item) {
    return item.addClass(options.selectedClass);
  };
  deselect = function(item) {
    return item.removeClass(options.selectedClass);
  };
  getPrimaryHostname = function(hostname) {
    if (/^.*\.tumblr\.com.*$/i.test(hostname)) {
      return "tumblr.com";
    } else {
      return hostname;
    }
  };
  hostname = getPrimaryHostname(window.location.hostname);
  options = $.extend(defaultOptions, sites[hostname]);
  jQuery(function() {
    var first;
    first = options.getFirst();
    if (first.length > 0) {
      return select(first);
    }
  });
  $(document).jkey("j, k", true, function(key) {
    var current, direction, elementBottom, elementTop, next, windowBottom, windowLeft, windowTop;
    current = $("." + options.selectedClass);
    direction = key === "j" ? "down" : direction = "up";
    if (direction === "down") {
      next = options.getNext(current);
    } else {
      next = options.getPrev(current);
    }
    windowLeft = pageXOffset;
    windowTop = pageYOffset;
    windowBottom = windowTop + $(window).height();
    if (next.length > 0) {
      deselect(current);
      select(next);
      elementTop = next.offset().top;
      elementBottom = elementTop + next.height();
      if (direction === "down" && elementBottom > windowBottom) {
        return scrollTo(windowLeft, elementBottom - $(window).height() + options.offsetBottom);
      } else if (direction === "up" && elementTop < windowTop) {
        return scrollTo(windowLeft, elementTop + options.offsetTop);
      }
    } else {
      if (direction === "down") {
        return scrollTo(windowLeft, windowBottom);
      } else {
        return scrollTo(windowLeft, 0);
      }
    }
  });
  if (options.onEnter) {
    $(document).jkey("enter, return", true, options.onEnter);
  }
  if (options.searchSelector) {
    $(document).jkey("/", function() {
      return $(options.searchSelector).focus();
    });
    $(options.searchSelector).jkey("escape", function() {
      return $(this).blur();
    });
  }
}).call(this);
