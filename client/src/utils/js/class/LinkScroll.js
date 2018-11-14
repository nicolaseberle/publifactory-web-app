// ----------------
// Class LinkScroll
// ----------------
// Used to add smooth scroll on every link with href="#" attribute


//import $ from "jquery";

// Smooth scroll object
// --------------------
var smoothScroll = {
    init: function(target, url, offset, delay, easing) {
        try {
            if (typeof url === undefined || url === "#") {
                throw "Internal URL not specified";
            } else {
                return $(target).animate({
                    scrollTop: $(url).offset().top - offset
                }, delay, easing);
            }
        } catch (e) {
            return console.log(e);
        }
    }
};

class LinkScroll {
    constructor(target, selector, offset, delay, easing) {
        this.target = target;
        this.selector = $(selector);
        this.url = $(selector).attr("href");
        this.offset = offset;
        this.delay = delay;
        this.easing = easing;
        this.selector.on("click", (e) => {
            this.scrollIt(e);
        });
    }
    scrollIt(e) {
        e.preventDefault();
        if (typeof this.url !== undefined || this.url !== "#") {
            return smoothScroll.init("html, body", this.url, this.offset, this.delay, this.easing);
        } else {
            return false;
        }
    }
    static init(parameters) {
        LinkScroll.instances = [];
        $(parameters.selector).each(function() {
            LinkScroll.instances.push(
                new LinkScroll(
                    parameters.target,
                    this,
                    parameters.offset,
                    parameters.delay,
                    parameters.easing
                )
            );
        });
    }
    static allInstances() {
        return LinkScroll.instances;
    }
}

export {
    smoothScroll,
    LinkScroll
};
