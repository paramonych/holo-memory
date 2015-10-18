function bindControls(cortex: Cortex): void {
  jQuery('#launch').on('click', function() {
    cortex.react();
  });

  bindTimeline();
}

function bindTimeline(): void {
  let $slider = jQuery('#slider');
    //instantiate a TimelineLite
  let timeline = new TimelineMax();

  //use position parameter "+=0.5" to schedule next tween 0.5 seconds after previous tweens end
  //tl.from(feature, 0.5, {scale:.5, autoAlpha:0}, "+=0.5");
  //use position parameter "-=0.5" to schedule next tween 0.25 seconds before previous tweens end. great for overlapping
  //tl.from(description, 0.5, {left:100, autoAlpha:0}, "-=0.25");

  jQuery("#play").click(function() { timeline.play()});
  jQuery("#pause").click(function() { timeline.pause()});
  jQuery("#restart").click(function() { timeline.restart()});

  //when the timeline updates, call the updateSlider function
  timeline.eventCallback("onUpdate", function() {
    let progress = timeline.progress() * 100;
    if(progress) {
      $slider.slider("value", progress);
    }
  });

  $slider.slider({
    range: false,
    min: 0,
    max: 100,
    step:.1,
    slide: function ( event, ui ) {
      timeline.pause();
      timeline.progress( ui.value/100 );
    }
  });
}


/*
var container = $("#container"),
    tl;

function getAnimation() {
  var element = $('<div class="creature"/>');
  container.append(element);
  TweenLite.set(element, {x:-30, y:300})
  //bezier magic provided by GSAP BezierPlugin (included with TweenMax)
  //http://api.greensock.com/js/com/greensock/plugins/BezierPlugin.html

 //create a semi-random tween
  var bezTween = new TweenMax(element, 6, {
    bezier:{
      type:"soft",
      values:[{x:60, y:80}, {x:150, y:30}, {x:400 + Math.random() *100, y:320*Math.random() + 50}, {x:500, y:320*Math.random() + 50}, {x:700, y:100}, {x:850, y:500}],
      autoRotate:true
    },
    ease:Linear.easeNone});
  return bezTween;
}

//create a bunch of Bezier tweens and add them to a timeline
function buildTimeline() {
  tl = new TimelineMax({repeat:300, onUpdate:updateSlider, delay:1});
  for (i = 0 ; i< 20; i++){
    //start creature animation every 0.17 seconds
    tl.add(getAnimation(), i * 0.17);
  }
}


// --- jQueryUI Controls --- //

jQuery("#slider").slider({
  range: false,
  min: 0,
  max: 1,
  step:0.001,
  slide: function ( event, ui ) {
    tl.pause();
    //adjust the timeline's progress() based on slider value
    tl.progress( ui.value);
    }
});

function updateSlider() {
  $("#slider").slider("value", tl.progress());
}

$("#slider, .ui-slider-handle").mousedown(function() {
  $('html, #slider, .ui-slider-handle').one("mouseup", function(e){
    tl.resume();
  });
});


//smoothe play pause by tweening the timeScale()

$("#playPause").click(function(){
  if(this.innerHTML === "play"){
    this.innerHTML = "pause"
    TweenLite.to(tl, 2, {timeScale:1})
  } else {
    this.innerHTML = "play"
    TweenLite.to(tl, 2, {timeScale:0})
  }
})

buildTimeline();
tl.progress(0.5).timeScale(0);
*/
