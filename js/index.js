define(function(require) {
	var Event = require('./lib/events');
	var Class = require('./lib/class');
	var Timer = require('./core/timer');
	
	timer = new Timer();
	timer.on('timer', function() {
		console.log('<><><><><><>');
	});
	timer.start();
});