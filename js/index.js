define(function(require) {
	var CanvasContext = require('context/CanvasContext');
	var Timer = require('utils/Timer');
	utils = require('utils/Utils');
	Class = require('lib/class');
  	Stage = require('display/Stage');
  	Bitmap = require('display/Bitmap');


	
	timer = new Timer();
	timer.on('timer', function() {
		//console.log('<><><><><><>');
	});
//	timer.start();
//	
	

	var canvas = document.getElementById('demo');
	var context = new CanvasContext({canvas: canvas});
	stage = new Stage({width: 480, height: 320, context: context});
	rect1 = new Bitmap({id:"blue", x:100, y:100, rotation:45, regX:25, regY:50, image:createRect(50, 100, "#00f")});
	stage.addChild(rect1);
	utils.toggleDebugRect(stage);
	stage.step();

	console.log(context);

	function createRect(w, h, color) {
		var canvas = document.createElement("canvas");
		canvas.width = w;
		canvas.height = h;
		var ctx = canvas.getContext("2d");
		ctx.fillStyle = color;
		ctx.rect(0, 0, w, h);
		ctx.fill();

		var img = new Image();
		img.src = canvas.toDataURL("image/png");
		img.width = w;
		img.height = h;
		return img;
	}
});