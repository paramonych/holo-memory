function setControls(scene: BABYLON.Scene): void {
  var animationBox = new BABYLON.Animation(
    'myAnimation',
    "scaling.x", 30,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);

  jQuery('#launch').on('click', function() {
    //scene.beginAnimation(box1, 0, 100, true);
    console.log('OK!!');
  });
}
