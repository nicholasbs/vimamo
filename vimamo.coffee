# Add new sites to support here
sites =
  "www.facebook.com":
    selector: ".uiStreamStory:visible"
    offsetBottom: 40
    offsetTop: -50
    selectedClass: "vimamo-fb-selected"
    searchSelector: ".uiSearchInput input[type=text]"
    onEnter: -> window.location = $(".vimamo-fb-selected .actorName a").attr("href")

  "tumblr.com":
    selector: ".post"
    offsetBottom: 10
    offsetTop: -10
    onEnter: -> window.location = $(".vimamo-selected .seeMore").attr("href")

  "news.ycombinator.com":
    selectedClass: "vimamo-hn-selected"
    searchSelector: "input[name=q]"
    getFirst: -> $("table tr table tr td.title").first().closest("tr")
    getNext: (current) ->
      next = current.next("tr")
      while next.length > 0 and next.find("td").length < 1
        next = next.next("tr")
      next.first()
    getPrev: (current) ->
      prev = current.prev "tr"
      while prev.length > 0 and prev.find("td").length < 1
        prev = prev.prev "tr"
      prev.first()
    onEnter: ->
      selected = $(".vimamo-hn-selected")
      if selected.find("td.subtext").length > 0 # submitted URL
        window.location = selected.find("td a:last-child").attr("href")
      else # comments link
        window.location = selected.find("td:last-child a").attr("href")

# You can override these for specific sites above
defaultOptions =
  selectedClass: "vimamo-selected"
  offsetBottom: 0
  offsetTop: 0
  getNext: (current) -> current.nextAll(options.selector).first()
  getPrev: (current) -> current.prevAll(options.selector).first()
  getFirst: -> $(options.selector).first()

select = (item) -> item.addClass options.selectedClass
deselect = (item) -> item.removeClass options.selectedClass

# Used for domains that need to be special-cased (e.g., for working across
# subdomains
getPrimaryHostname = (hostname) ->
  if /^.*\.tumblr\.com.*$/i.test hostname then "tumblr.com" else hostname

hostname = getPrimaryHostname(window.location.hostname)
options = $.extend(defaultOptions, sites[hostname])

jQuery ->
  first = options.getFirst()
  select first if first.length > 0

$(document).jkey("j, k", true, (key) ->
  current = $("." + options.selectedClass)
  direction = if key is "j" then "down" else direction = "up"

  if direction is "down"
    next = options.getNext(current)
  else # up
    next = options.getPrev(current)

  windowLeft = pageXOffset
  windowTop = pageYOffset
  windowBottom = windowTop + $(window).height()

  if next.length > 0
    deselect current
    select next

    elementTop = next.offset().top
    elementBottom = elementTop + next.height()

    if direction is "down" and elementBottom > windowBottom
      scrollTo(windowLeft, elementBottom - $(window).height() + options.offsetBottom)
    else if direction is "up" and elementTop < windowTop
      scrollTo(windowLeft, elementTop + options.offsetTop)
  else # last element
    if direction is "down" then scrollTo(windowLeft, windowBottom) else scrollTo(windowLeft, 0)
)

if options.onEnter
  $(document).jkey("enter, return", true, options.onEnter)

if options.searchSelector
  $(document).jkey("/", ->
    $(options.searchSelector).focus()
  )
  
  $(options.searchSelector).jkey("escape", ->
    $(this).blur()
  )
