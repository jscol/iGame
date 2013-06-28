define(function(require) {
	var CanvasContext = require('context/CanvasContext');
	var Timer = require('utils/Timer');
	iGame = require('core/iGame');
	utils = require('utils/Utils');
	Class = require('lib/class');
  	Stage = require('display/Stage');
  	Bitmap = require('display/Bitmap');
  	Graphics = require('display/Graphics');
  	MovieClip = require('display/MovieClip');
  	DisplayObjectContainer = require('display/DisplayObjectContainer');



/*
var container, stage, context, girl, boy, width, height, timer, fps, events, params;
var bmp1, bmp2, mc;

window.onload = function() {

	container = iGame.getDOM('container');
	girl = iGame.getDOM('girl');
	boy = iGame.getDOM('boy');
	events = iGame.supportTouch ? ['touchend'] : ['mouseup'];

	width = 480;
	height = 320;
	fps = 60;

	var canvas = iGame.createDOM("canvas", {width:width, height:height, style:{position:"absolute",backgroundColor:"#fff"}});		
	container.appendChild(canvas);
	context = new CanvasContext({canvas:canvas});

	start();
}

function start() {
	stage = new Stage({width: width, height: height, context: context, update: update});

	bmp1 = new Bitmap({image: girl, rect: [0,0,64,85], regX: 32, regY: 42});
	bmp1.rotation = 0;
	bmp1.x = 300;
	bmp1.y = 100;
	bmp1.enabled = true;

	bmp2 = new Bitmap({image: boy, rect: [0,0,64,85], regX: 32, regY: 42});
	bmp2.x = 100;
	bmp2.y = 100;
	bmp2.scaleX = 2;
	bmp2.scaleY = 2;

	mc = new MovieClip({image: girl, interval: 100});
	mc.addFrame([
		{rect:[0,0,64,85], label:"stand", stop:1},
		{rect:[192,0,64,85], label:"walk"},
		{rect:[192,85,64,85], jump:"walk"},
		{rect:[320,0,64,85], label:"cheer"},
		{rect:[384,0,64,85]},
		{rect:[448,0,64,85], jump:"cheer"}
	]);
	mc.x = 150;
	mc.y = 150;
	mc.gotoAndPlay('cheer');

	stage.addChild(bmp1, bmp2, mc);

	timer = new Timer(1000/fps);
	timer.on('timer', function() {
		stage.step(timer.info);
	});
	timer.start();
}

function update() {
	frames++;
	bmp1.rotation += 5;
}

var frames = 0, fpsContainer = iGame.getDOM('fps');
setInterval(function() {
	fpsContainer.innerHTML = 'FPS:' + frames;
	frames = 0;
}, 1000);
*/

/*
window.onload = init;

var container, stage, context, girl, boy, width, height, timer, fps, events, params;
var box, rect1, rect2;

function init()
{
	container = iGame.getDOM("container");
	events = iGame.supportTouch ? ["touchend"] : ["mouseup"];

	width = 480;
	height = 320;
	fps = 60;

	var canvas = iGame.createDOM("canvas", {width:width, height:height, style:{position:"absolute",backgroundColor:"#fff"}});		
	container.appendChild(canvas);
	context = new CanvasContext({canvas:canvas});		

	start();
}

function start()
{	
	stage = new Stage({width:width, height:height, context:context, update:update});
	utils.toggleDebugRect(stage);
	stage.addEventListener(events[0], onEvent);

	box = new DisplayObjectContainer({id:"box", x:300, y:0, rotation:90, width:width, height:height, eventEnabled:false});
	rect1 = new Bitmap({id:"blue", x:100, y:100, rotation:0, regX:25, regY:50, image:createRect(50, 100, "#00f")});
	rect2 = new Bitmap({id:"green", x:rect1.x+90, y:rect1.y, regX:25, regY:50, image:createRect(50, 100, "#0f0")});
	stage.addChild(box.addChild(rect1, rect2));
	
	//try this code to see the effect
	//rect2.polyArea = [{x:25, y:0}, {x:50, y:15}, {x:25, y:30}, {x:0, y:15}];
	
	// var em = new Q.EventManager();
	// em.registerStage(stage, events);

	timer = new Timer(1000/fps);
	timer.on('timer', function() {
		stage.step(timer.info);
	});
	timer.start();
}

function update()
{
	frames++;	
	rect1.rotation -= 1;
	rect2.rotation += 1;
	var hit = rect1.hitTestObject(rect2);
	rect1.alpha = rect2.alpha = hit ? 0.5 : 1;
}

function onEvent(e)
{
	var obj1 = e.eventTarget, obj2 = e.lastEventTarget;
	if(obj1) obj1.scaleX = obj1.scaleY = 1.5;
	if(obj2) obj2.scaleX = obj2.scaleY = 1.0;
}

function createRect(w, h, color)
{
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

var frames = 0, fpsContainer = iGame.getDOM("fps");
setInterval(function()
{
	fpsContainer.innerHTML = "FPS:" + frames;
	frames = 0;
}, 1000);
*/	

/*
window.onload = init;

var timer, container, context, params, width, height, fps, stage;

function init()
{	
	container = iGame.getDOM("container");
	
	width = 480;
	height = 320;
	fps = 60;

	var canvas = iGame.createDOM("canvas", {width:width, height:height, style:{position:"absolute",backgroundColor:"#fff"}});		
	container.appendChild(canvas);
	context = new CanvasContext({canvas:canvas});		
	
	stage = new Stage({context:context, width:width, height:height, update:function()
	{
		frames++;
	}});
	
	timer = new Timer(1000/fps);
	timer.on('timer', function() {
		stage.step(timer.info);
	});
	timer.start();

	draw();
}

function draw()
{
	var g1 = new Graphics({width:200, height:200, x:20, y:20});
	g1.lineStyle(1, "#00f").beginFill("#0ff").drawRect(0.5, 0.5, 100, 100).endFill().cache();
	
	var g2 = new Graphics({width:200, height:200, x:150, y:20});
	g2.lineStyle(10, "#431608").beginFill("#0ff").drawRoundRect(5, 5, 90, 90, 20).endFill().cache();
	
	var g3 = new Graphics({width:200, height:200, x:270, y:20});
	g3.lineStyle(2, "#7db9e8").drawCircle(2, 2, 50).beginRadialGradientFill(50, 50, 0, 50, 50, 50, ["#7db9e8", "#1E5799"], [0, 1]).endFill().cache();
	
	var g4 = new Graphics({width:200, height:200, x:20, y:150});
	g4.drawEllipse(5, 5, 150, 100).lineStyle(5, "#12161f").beginFill("#0ff").endFill().cache();
	
	var g5 = new Graphics({width:200, height:200, x:200, y:150});
	g5.lineStyle(4, "#111").beginLinearGradientFill(0, 0, 60, 0, ["#959595", "#010101", "#4e4e4e", "#383838", "#1b1b1b"], [0, 0.5, 0.76, 0.87, 1]).drawRect(2, 2, 60, 100).endFill().cache();	

	var svgPath = "M153 334 C153 334 151 334 151 334 C151 339 153 344 156 344 C164 344 171 339 171 334 C171 322 164 314 156 314 C142 314 131 322 131 334 C131 350 142 364 156 364 C175 364 191 350 191 334 C191 311 175 294 156 294 C131 294 111 311 111 334 C111 361 131 384 156 384 C186 384 211 361 211 334 C211 300 186 274 156 274";
	var g6 = new Graphics({width:500, height:500, x:200, y:-130});
	g6.drawSVGPath(svgPath).lineStyle(4, "#0f0").endFill().cache();

	stage.addChild(g1, g2, g3, g4, g5, g6);
}

var frames = 0, fpsContainer = iGame.getDOM("fps");
setInterval(function()
{
	fpsContainer.innerHTML = "FPS:" + frames;
	frames = 0;
}, 1000);
*/












});