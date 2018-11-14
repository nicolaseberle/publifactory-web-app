// ----------------------------------------------------
// Animation of the Nav on the left of the article page
// ----------------------------------------------------

import ScrollMagic from 'scrollmagic/scrollmagic/uncompressed/ScrollMagic';
import 'scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap';
import 'scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators';
import { TweenMax, TimelineMax } from 'gsap'



function navAnimation() {
    var controller = new ScrollMagic.Controller();

    // Start animating nav
    // -------------------
    var navStartPosition = TweenMax.to("#nav", 0.4, {
        css: {
            y: -120
        },
        ease: Linear.easeNone
    });
    var initNavPosition = new ScrollMagic.Scene({
            triggerElement: "#triggerStartNav",
            offset: ($(window).height() / 2) - 80,
            duration: 80
        })
        .setTween(navStartPosition)
        // .addIndicators()
        .addTo(controller);

    // Style the nav links on click
    // ----------------------------
    var mainNav = {
        links: $("body main nav a")
    };

    mainNav.links.on("click", function() {
        mainNav.links.removeClass("active");
        mainNav.links.removeClass("viewed");
        $(this).addClass("active");
        mainNav.links.each(function() {
            if (!$(this).hasClass("active")) {
                $(this).toggleClass("viewed");
            } else {
                return false;
            }
        });
    });

    // End animating nav
    // -------------------
    var navFinishPosition = TweenMax.to("#nav", 0, {
        css: {
            position: "absolute",
            left: "0",
            bottom: "-120"
        },
        ease: Linear.easeNone
    });
    var finishNavPosition = new ScrollMagic.Scene({
            triggerElement: "#triggerEndNav",
            offset: 0
        })
        .setTween(navFinishPosition)
        // .addIndicators()
        .addTo(controller);
}

export default navAnimation;
