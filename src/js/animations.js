function bindControls(cortex) {
    jQuery('#launch').on('click', function () {
        console.log('OK!!');
        cortex.draw();
        cortex.react();
    });
}
