function bindControls(cortex: Cortex): void {
  jQuery('#launch').on('click', function() {
    //scene.beginAnimation(box1, 0, 100, true);
    console.log('OK!!');
    cortex.draw();
    cortex.react();
  });
}
