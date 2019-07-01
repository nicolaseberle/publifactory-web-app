// -----------------------
// Entrie point of the app
// -----------------------

// Imports
// -------

import 'scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap'
import 'scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators'

import svgInline from './function/svg.inline.js'
import { LinkScroll } from './class/LinkScroll.js'
import headerNavigation from './animation/header.js'
import navAnimation from './animation/nav.js'
import accordion from './animation/accordion.js'
import asideRightAnimation from './animation/aside.right.js'

// Call instances
// --------------
var inst_svgInline = new svgInline();
var inst_navAnimation = new navAnimation();
var inst_headerAnimation = new headerNavigation();
var inst_accordion = new accordion();
var inst_asideRightAnimation = new asideRightAnimation();

// Init LinkScroll on every a[href^='#']
// -------------------------------------
LinkScroll.init({
    target: "html, body",
    selector: "a[href^='#']",
    offset: 125,
    delay: 800,
    easing: "swing"
});
