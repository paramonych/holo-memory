function setControls(scene) {
    var animationBox = new BABYLON.Animation('myAnimation', "scaling.x", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);
    jQuery('#launch').on('click', () => {
        console.log('OK!');
    });
}
