// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

/* ******************************************************************** */

/* Article at http://creativejs.com/resources/requestanimationframe/

What if I want to set a frame rate?

var fps = 15;
function draw() {
  setTimeout(function() {
    requestAnimationFrame(draw);
    // Drawing code goes here
  }, 1000 / fps);
}

-= OR =-

var time;
function draw() {
  requestAnimationFrame(draw);
  var now = new Date().getTime(),
    dt = now - (time || now);
 
  time = now;
 
  // Drawing code goes here... for example updating an 'x' position:
  this.x += 10 * dt; // Increase 'x' by 10 units per millisecond
}





*/