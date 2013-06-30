define(function(require) {
	var Event = require('core/Events');
	var Class = require('core/Class');

	/** @lends Timer */
	var Timer = Class.create({
		Implements: Event,

		/**
		 * @name Timer
		 * @class Timer是个计时器。
		 * @constructor
		 * @extends {Class} Class
		 * @requires Events
		 * @param {int} interval 计时器的时间间隔。
		 */
		initialize: function(interval) {
			this.interval = interval || 50;
			this.paused = false;
			this.info = {lastTime:0, currentTime:0, deltaTime:0, realDeltaTime:0};

			this._startTime = 0;
			this._intervalID = null;
			this._listeners = [];
		},
		/**
		 * 启动计时器
		 */
		start: function() {
			if (this._intervalID != null) return;
			this._startTime = this.info.lastTime = this.info.currentTime = Date.now();
			var me = this;
			var run = function() {
				me._intervalID = setTimeout(run, me.interval);
				me._run();
			};
			run();
		},
		/**
		 * 停止计时器
		 */
		stop: function() {
			clearTimeout(this._intervalID);
			this._intervalID = null;
			this._startTime = 0;
		},
		/**
		 * 暂停计时器
		 */
		pause: function() {
			this.paused = true;
		},
		/**
		 * 恢复计时器
		 */
		resume: function() {
			this.paused = false;
		},
		/**
		 * 计时器回调。当达到执行条件时，调用所有侦听器的step方法
		 * @private
		 */
		_run: function() {
			if (this.paused) return;

			var info = this.info;
			var time = info.currentTime = Date.now();
			info.deltaTime = info.realDeltaTime = time - info.lastTime;
			this.trigger('timer');

			for (var i = 0, len = this._listeners.length, obj, runTime; i < len; i++) {
				obj = this._listeners[i];
				runTime = obj.__runTime || 0;
				if (runTime == 0) {
					// obj.step(this.info);
					this.trigger('timer');
				} else if (time > runTime) {
					// obj.step(this.info);
					// this._listeners.splice(i, 1);
					this.trigger('timer');
					this.off('timer');
					i--;
					len--;
				}
			}

			info.lastTime = time;
		},
		/**
		 * 延时执行
		 * @param {Function} callback 调用的方法。
		 * @param {int} time 延迟的时间。
		 */
		delay: function(callback, time) {
			var obj = {step: callback, __runTime: Date.now() + time};
			// this.addListener(obj);
			this.on('timer', callback);
		}
	});

	return Timer;
});