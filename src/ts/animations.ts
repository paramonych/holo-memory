function bindControls(cortex: Cortex): void {
  jQuery('#launch').on('click', function() {
    cortex.react();
  });
}
