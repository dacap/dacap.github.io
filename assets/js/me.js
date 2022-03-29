$(function(){
 var prefixes = ['', '-o-', '-ms-', '-moz-', '-webkit-'];
 var $homeIcon = $('#home-icon');
 var lock = false;

 function cross_css($elem, prop, value, both) {
   for (var i=0; i<prefixes.length; ++i)
     $elem.css(prefixes[i]+prop, both ? prefixes[i]+value: value);
 }

 function changeFace() {
  if (lock) return;
  lock = true;
  cross_css($homeIcon, 'transition', 'transform 0.250s linear', true);
  cross_css($homeIcon, 'transform', 'rotateY(90deg)');
  setTimeout(function() {
   var prevPos = $homeIcon.css('background-position');
   do {
    var rw = Math.floor(6.99 * Math.random());
    var rh = Math.floor(3.99 * Math.random());
    $homeIcon.css('background-position', (-80*rw) + 'px ' + (-80*rh) + 'px ');
   } while ($homeIcon.css('background-position') == prevPos);
   cross_css($homeIcon, 'transition', 'transform 0.250s linear', true);
   cross_css($homeIcon, 'transform', 'rotateY(0deg)');
   setTimeout(function() { lock = false; }, 1000);
  }, 250);
 }

 $('#home').mouseover(changeFace);
});
