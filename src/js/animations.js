function bindControls(cortex) {
    jQuery('#launch').on('click', function () {
        cortex.react();
    });
    bindTimeline();
}
function bindTimeline() {
    var $slider = jQuery('#slider');
    var timeline = new TimelineMax();
    jQuery("#play").click(function () { timeline.play(); });
    jQuery("#pause").click(function () { timeline.pause(); });
    jQuery("#restart").click(function () { timeline.restart(); });
    timeline.eventCallback("onUpdate", function () {
        var progress = timeline.progress() * 100;
        if (progress) {
            $slider.slider("value", progress);
        }
    });
    $slider.slider({
        range: false,
        min: 0,
        max: 100,
        step: .1,
        slide: function (event, ui) {
            timeline.pause();
            timeline.progress(ui.value / 100);
        }
    });
}
