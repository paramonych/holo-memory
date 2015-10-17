function bindControls(cortex) {
    jQuery('#launch').on('click', function () {
        cortex.react();
    });
    bindTimeline();
}
function bindTimeline() {
    var tl = new TimelineLite();
    jQuery("#play").click(function () { tl.play(); });
    jQuery("#pause").click(function () { tl.pause(); });
    jQuery("#restart").click(function () { tl.restart(); });
    jQuery("#slider").slider({
        range: false,
        min: 0,
        max: 100,
        step: .1
    });
    function updateSlider() {
        jQuery("#slider").slider("value", tl.progress() * 100);
    }
}
