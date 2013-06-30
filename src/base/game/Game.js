define(function(require) {
	var Base = require('core/Base');
	var Class = require('core/Class');
	var utils = require('utils/Utils');
	var Timer = require('utils/Timer');
	var Tween = require('utils/Tween');
	var CanvasContext = require('context/CanvasContext');
	var Stage = require('display/Stage');

	/** @lends Game */
	var Game = Class.create({
		/**
		 * @name Game
		 * @class  Game类。游戏事件、场景管理类。
		 * @constructor
		 * @extends {Class} Class
		 */
		initialize: function(id, scene, width, height, fps, scale) { //TODO
			this.canvas = Base.getDOM(id);
			this.context = new CanvasContext({canvas: this.canvas});
			this.stage = new Stage({width: width, height: height, context: this.context});
			if (typeof scene == 'function') {
				this.scene = new (scene)({stage: this.stage});
				this.stage.addChild(this.scene);
			}
			this.fps = fps || 30;
			this.timer = new Timer(1000/fps);
			this.timer.on('timer', this.update.bind(this));

			this.initEvent();
			this.scene.onEnter();
		},
		/**
		 * 游戏入口类。
		 */
		start: function() {
			this.timer.start();
		},
		/**
	     * 对象数据更新接口，可通过重写此方法实现对象的数据更新。
	     */
		update: function() {
			Tween.step(this.timer.info);
			this.stage.step(this.timer.info);
			// this.scene.update(this.timer.info);
		},
		/**
		 * 事件初始化。
		 * @return {[type]} [description]
		 */
		initEvent: function() {
			var pos = Base.getElementOffset(this.canvas);
			this.originX = pos.left;
			this.originY = pos.top;

			if (Base.isMobile) {
				this.canvas.addEventListener('touchstart', this.mousedown.bind(this), false);
				this.canvas.addEventListener('touchend', this.mouseup.bind(this), false);
				this.canvas.addEventListener('touchmove', this.mousemove.bind(this), false);
			} else {
				this.canvas.addEventListener('mousedown', this.mousedown.bind(this), false);
				this.canvas.addEventListener('mouseup', this.mouseup.bind(this), false);
				this.canvas.addEventListener('mousemove', this.mousemove.bind(this), false);
			}
		},
		/**
		 * 鼠标按下处理函数。
		 */
		//TODO: cache events
		mousedown: function(e) {
			e.preventDefault();
			this._updateMouse(e);
			this.scene.mousedown();
			this._trigger(this.lastDown = this.stage.getObjectUnderPoint(mouse.x, mouse.y), 'mousedown');
		},
		/**
		 * 鼠标弹起处理函数。
		 */
		mouseup: function(e) {
			e.preventDefault();
			this._updateMouse(e);
			this.scene.mouseup();

			var obj = this.stage.getObjectUnderPoint(mouse.x, mouse.y);
			if (obj) {
				this._trigger(obj, 'mouseup');
				if (obj == this.lastDown) {
					this._trigger(obj, 'click');
				}
			}
			this.lastDown = null;
		},
		/**
		 * 鼠标移动处理函数。
		 */
		mousemove: function(e) {
			e.preventDefault();
			this._updateMouse(e);
			this.scene.mousemove();

			var drag, tmp;
			if (this.lastDown) {
				if (this.lastDown._draggable) {
					drag = this.lastDown;
				} else if (tmp = this._getDraggableParent(this.lastDown)) {
					drag = tmp;
				}
				if (drag) {
					drag.x += mouse.deltaX;
					drag.y += mouse.deltaY;
				}
			}
		},
		_getDraggableParent: function(obj) {
			var pnt;
			while (pnt = obj.parent) {
				if (!pnt.stage && pnt._draggable) break;
				obj = pnt;
			}
			return pnt;
		},
		_updateMouse: function(e) {
			var layerX, layerY;
			if (this.mobile) {
				if (e.type == 'touchend') {
					layerX = e.changedTouches[0].clientX;
					layerY = e.changedTouches[0].clientY;
				} else if (e.touches && e.touches[0]) {
					layerX = e.touches[0].clientX;
					layerY = e.touches[0].clientY;
				}
				layerX -= this.originX;
				layerY -= this.originY;
			} else {
				layerX = e.offsetX || e.layerX;
				layerY = e.offsetY || e.layerY;
			}

			mouse.lastX = mouse.x || 0;
			mouse.lastY = mouse.y || 0;

			mouse.x = parseInt(layerX / this.scene.scaleX);
			mouse.y = parseInt(layerY / this.scene.scaleY);

			mouse.deltaX = mouse.x - mouse.lastX;
			mouse.deltaY = mouse.y - mouse.lastY;
		},
		_trigger: function(obj, type) {
			if (!obj) return;

			var evt = new _Event(obj, type);
			obj.trigger(type, evt);
			if (!evt.propagationStopped && obj.parent) {
				this._trigger(obj.parent, type);
			}
		}
	});

	var mouse = {};

	var _Event = Class.create({
		initialize: function(displayObj, type) {
			this.type = type;
			this.target = displayObj;
			this.timeStamp = new Date().getTime();
			this.propagationStopped = false;
			this.mouse = mouse;
		},
		stopPropagation: function() {
			this.propagationStopped = true;
		}
	});

	return Game;
});