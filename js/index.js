define(function(require) {
	var Event = require('lib/events');
	var Class = require('lib/class');
	var Timer = require('utils/Timer');
  DisplayObject = require('display/DisplayObject');

  cat = new DisplayObject({name: 'zero'});

	
	timer = new Timer();
	timer.on('timer', function() {
		//console.log('<><><><><><>');
	});
//	timer.start();
});