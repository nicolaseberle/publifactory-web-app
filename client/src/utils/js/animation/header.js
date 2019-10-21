// ----------------------------------------------------
// Animation of the header
// ----------------------------------------------------

import ScrollMagic from 'scrollmagic/scrollmagic/uncompressed/ScrollMagic'
import 'scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap'
import 'scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators'
import { TweenMax } from 'gsap'

//import $ from "jquery";

function headerAnimation() {
    var controller = new ScrollMagic.Controller();

    // Start animating header
    // ----------------------
    var headerPosition = TweenMax.to("#header", 0, {
        css: {
            position: "fixed",
            top: 0
        },
        ease: Linear.easeNone
    });
    var startHeaderPosition = new ScrollMagic.Scene({
            triggerElement: "#triggerStartNav",
            offset: $(window).height() / 2,
            duration: 0
        })
        .setTween(headerPosition)
        // .addIndicators()
        .addTo(controller);

    // Change position of the aside right related to the new header
    // ------------------------------------------------------------
    var asidePosition = TweenMax.to("#triggerAside", 0.5, {
        css: {
            position: "fixed",
            top: 100,
            height: $(window).height() - 100
        },
        ease: Linear.easeNone
    });
    var startAsidePosition = new ScrollMagic.Scene({
            triggerElement: "#triggerStartNav",
            offset: ($(window).height() / 2) - 80,
            duration: 80
        })
        .setTween(asidePosition)
        // .addIndicators()
        .addTo(controller);

    // Change position of the main related to the new header
    // -----------------------------------------------------
    var mainPosition = TweenMax.to("#main", 0, {
        css: {
            position: "relative",
            top: 200
        },
        ease: Linear.easeNone
    });
    var startMainPosition = new ScrollMagic.Scene({
            triggerElement: "#triggerStartNav",
            offset: $(window).height() / 2,
            duration: 0
        })
        .setTween(mainPosition)
        // .addIndicators()
        .addTo(controller);
}

export default headerAnimation;
