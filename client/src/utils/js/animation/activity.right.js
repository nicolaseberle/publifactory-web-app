import $ from 'jquery'

const debug = require('debug')('frontend');

function asideRightActivity () {
    // Selectors object
    // ----------------
  const asideRightActivity = {
    tags: $('.header-activity'),
    button: $('aside.activity'),
    pannel: {
      all: $('aside.content-activity'),
      links: $('aside.content-activity a'),
      // reviews: $('aside.content-activity a.showactivity'),
      // comments: $('aside.content-activity a.showcomments'),
      close: $(' aside.content-activity a.close-activity'),
      //article: $('aside.content-activity  [data-review]')
    },
    // comments: $('aside.content-activity section.comments'),
    // reviews: $('aside.content-activity section.reviews'),
    scroll: {
      reviews: 0,
      comments: 0
    }
  }

  // Functions show or hide pannel
  // -----------------------------
  function showActivityPannel () {
    asideRightActivity.pannel.all.css('display', 'block')
  }

  function hideActivityPannel () {
    asideRightActivity.pannel.all.css('display', 'none')
  }

  // Function maj the scroll position object
  // ---------------------------------------
  /*
  function majScrollPosition () {
    if (asideRight.comments.css('display') === 'block') {
      asideRight.scroll.comments = asideRight.comments.scrollTop()
      debug(asideRight.scroll.comments)
    } else {
      asideRight.scroll.reviews = asideRight.reviews.scrollTop()
      debug(asideRight.scroll.reviews)
    }
  }*/

  // Function go to the previous position scroll of the pannel
  // ---------------------------------------------------------
  /*
  function goPreviousScrollPosition () {
    var offset = 0
    var delay = 0
    if (asideRight.comments.css('display') === 'block') {
      asideRight.comments.animate({
        scrollTop: asideRight.scroll.comments - offset
      }, delay)
    } else {
      asideRight.reviews.animate({
        scrollTop: asideRight.scroll.reviews - offset
      }, delay)
    }
  }*/

    // Show the pannel on click
    // ------------------------
  asideRightActivity.button.on('click', () => {
    debug('asideRight_button_click')
    showActivityPannel()
    // goPreviousScrollPosition()
  })

  asideRightActivity.tags.on('click', () => {
    debug('tags_button_click')
    showActivityPannel()
    // goPreviousScrollPosition()
  })

  // Close the pannel on click
  // -------------------------
  asideRightActivity.pannel.close.on('click', () => {
    debug('asideRight_pannel_close')
    // majScrollPosition()
    hideActivityPannel()
  })

  // Comments or Reviews pannel selection
  // ------------------------------------
  /*
  asideRight.pannel.comments.on('click', () => {
    asideRight.pannel.links.removeClass('active')
    asideRight.pannel.comments.addClass('active')
    majScrollPosition()
    asideRight.reviews.css('display', 'none')
    asideRight.comments.css('display', 'block')
    goPreviousScrollPosition()
  })

  asideRight.pannel.reviews.on('click', () => {
    asideRight.pannel.links.removeClass('active')
    asideRight.pannel.reviews.addClass('active')
    majScrollPosition()
    asideRight.comments.css('display', 'none')
    asideRight.reviews.css('display', 'block')
    goPreviousScrollPosition()
  })

  asideRight.pannel.article.on('click', function () {
    const markup = $(this).attr('data-review')
    debug('markup : ' + markup)
    const articleText = $("main article span[data-review='" + markup + "'")
    debug('articleText : ' + articleText)
    const accordionPannel = articleText.parents('div.accordion-panel').get(0)
    accordionPannel.style.display = 'block'
    accordionPannel.previousElementSibling.classList.remove('collapsed-180deg', 'collapsed-90deg')

    var offset = 200
    var delay = 1000
    $('html, body').animate({
      scrollTop: $(articleText).offset().top - offset
    }, delay, 'swing')
  })
  asideRight.pannel.article.mouseenter(function () {
    const markup = $(this).attr('data-review')
    debug('markup : ' + markup)
    const articleText = $("main article span[data-review='" + markup + "'")
    articleText.css('background-color', 'rgba(92, 115, 141, 0.3)')
  })
  asideRight.pannel.article.mouseleave(function () {
    const markup = $(this).attr('data-review')
    const articleText = $("main article span[data-review='" + markup + "'")
    articleText.css('background-color', 'white')
  })*/
}

export default asideRightActivity
