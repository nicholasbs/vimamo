// Add new sites to support here
var sites = {
  "www.facebook.com": {
    selector: ".uiStreamStory",
    offsetBottom: 30,
    offsetTop: -10,
    selectedClass: "vimamo-fb-selected"
  },
  "tumblr.com": {
    selector: ".post",
    onEnter: function() { location = $(".vimamo-selected .seeMore").attr("href"); },
    offsetBottom: 10,
    offsetTop: -10
  }
};

// You can override these for specific sites above
var defaultOptions = {
  selectedClass: "vimamo-selected",
  offsetBottom: 0,
  offsetTop: 0
};

var hostname = getPrimaryHostname(location.hostname);
var options = $.extend(defaultOptions, sites[hostname]);

$(document).ready(function() {
  var els = $(options.selector);
  if (els.length > 1) {
    select(els.first());
  }
});

$(document).jkey("j, k", true, function(key) {
  var next,
      current = $("." + options.selectedClass),
      direction = "up";

  if (key === "j") { // down
    next = current.nextAll(options.selector).first();
    direction = "down";
  } else { // key == "k" up
    next = current.prevAll(options.selector).first();
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
