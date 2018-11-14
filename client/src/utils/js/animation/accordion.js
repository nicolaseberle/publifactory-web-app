// ------------------
// Function accordion
// ------------------
// Used to hide or display accordion pannel on article page

function accordion() {
    var accordionLeft = document.getElementsByClassName("accordion-control-left");
    var accordionRight = document.getElementsByClassName("accordion-control-right");
    var i;

    for (i = 0; i < accordionLeft.length; i++) {
        accordionLeft[i].onclick = function() {
            /* Toggle between adding and removing the "active" class,
            to highlight the button that controls the panel */
            this.classList.toggle("collapsed-180deg");

            /* Toggle between hiding and showing the active panel */
            var panel = this.nextElementSibling;
            if (this.classList.contains("collapsed-180deg")) {
                panel.style.display = "none";
            } else {
                panel.style.display = "block";
            }
        };
    }
    for (i = 0; i < accordionRight.length; i++) {
        accordionRight[i].onclick = function() {
            /* Toggle between adding and removing the "active" class,
            to highlight the button that controls the panel */
            this.classList.toggle("collapsed-90deg");

            /* Toggle between hiding and showing the active panel */
            var panel = this.nextElementSibling;
            if (this.classList.contains("collapsed-90deg")) {
                panel.style.display = "none";
            } else {
                panel.style.display = "block";
            }
        };
    }
}

export default accordion;
