function bindControls(cortex) {
    jQuery('#launch').on('click', function () {
        cortex.react();
    });
}
