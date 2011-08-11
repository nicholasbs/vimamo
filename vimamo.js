// Add new sites to support here
var sites = {
  "www.facebook.com": {
    selector: ".uiStreamStory",
    offsetBottom: 30,
    offsetTop: -10,
    selectedClass: "vimamo-fb-selected",
    searchSelector: ".uiSearchInput input[type=text]",
    onEnter: function() { location = $(".vimamo-fb-selected .actorName a").attr("href"); }
  },
  "tumblr.com": {
    selector: ".post",
    onEnter: function() { location = $(".vimamo-selected .seeMore").attr("href"); },
    offsetBottom: 10,
    offsetTop: -10
  },
  "news.ycombinator.com": {
    selectedClass: "vimamo-hn-selected",
    // These functions look crazy because HN has bad markup and few classes.
    getFirst: function() {
      return $("table tr table tr td.title").first().closest("tr");
    },
    getNext: function(current) {
      var next = current;
      do {
        next = next.next("tr");
      } while (next.length > 0 && next.find("td").length < 1)
      return next.first();
    },
    getPrev: function(current) {
      var prev = current;
      do {
        prev = prev.prev("tr");
      } while (prev.length > 0 && prev.find("td").length < 1) // ignore empty tr
      return prev.first();
    },
    onEnter: function() {
      var selected = $(".vimamo-hn-selected")
      if (selected.find("td.subtext").length > 0) { // submitted URL
        location = selected.find("td a:last-child").attr("href");
      } else { // comments link
        location = selected.find("td:last-child a").attr("href");
      }
    },
    searchSelector: "input[name=q]"
  }
};

// You can override these for specific sites above
var defaultOptions = {
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

var hostname = getPrimaryHostname(location.hostname);
var options = $.extend(defaultOptions, sites[hostname]);

$(document).ready(function() {
  var first = options.getFirst();
  if (first.length > 0) {
    select(first);
  }
});

$(document).jkey("j, k", true, function(key) {
  var next,
      current = $("." + options.selectedClass),
      direction = "up";

  if (key === "j") { // down
    next = options.getNext(current);
    direction = "down";
  } else { // key == "k" up
    next = options.getPrev(current);
  }

  var windowLeft = pageXOffset,
      windowTop = pageYOffset,
      windowBottom = windowTop + $(window).height();

  if (next.length > 0) {
    deselect(current);
    select(next);

    var elementTop = next.offset().top,
        elementBottom = elementTop + next.height();

    if (direction === "down") {
      if (elementBottom > windowBottom) {
        scrollTo(windowLeft, elementBottom - $(window).height() + options.offsetBottom);
      }
    } else if (elementTop < windowTop) { // up
        scrollTo(windowLeft, elementTop + options.offsetTop);
    }
  } else { // last element
    direction === "down" ? scrollTo(windowLeft, windowBottom) : scrollTo(windowLeft, 0);
  }
});

if (options.onEnter) {
  $(document).jkey("enter, return", true, options.onEnter);
}

if (options.searchSelector) {
  $(document).jkey("/", function() {
    $(options.searchSelector).focus();
  });

  $(options.searchSelector).jkey("escape", function() {
    $(this).blur();
  });
}


function select(item) {
  item.addClass(options.selectedClass);
}

function deselect(item) {
  item.removeClass(options.selectedClass);
}

// Used for domains that need to be special-cased (e.g., for working across
// subdomains).
function getPrimaryHostname(hostname) {
  if (/^.*\.tumblr\.com.*$/i.test(hostname)) {
    return "tumblr.com";
  }
  return hostname;
}
