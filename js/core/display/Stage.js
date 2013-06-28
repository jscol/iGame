define(function(require) {
	var iGame = require('core/iGame');
	var utils = require('utils/Utils');
	var Rectangle = require('geom/Rectangle');
	var DisplayObjectContainer = require('display/DisplayObjectContainer');

	/**
	 * @name {Stage:[name]}
	 * @augments {DisplayObjectContainer}
	 * @class  舞台是显示对象的根，所有的显示对象都会被添加到舞台上，必须传入一个context使得舞台能被渲染。舞台是一种特殊的显示对象容器，可以容纳子显示对象。
	 * @property stageX 舞台在页面中的x偏移量，即offsetLeft。只读属性。可通过调用updatePosition()方便更新。
	 * @property stageY 舞台在页面中的y偏移量，即offsetTop。只读属性。可通过调用updatePosition()方法更新。
	 * @property paused 指示舞台更新和渲染是否暂停。默认为false。
	 * @argument props 参数JSON格式为：{context: context} context上下文必须指定。
	 */
	var Stage = DisplayObjectContainer.extend({
		initialize: function(props) {
			this.stageX = 0;
			this.stageY = 0;
			this.paused = false;
			//判断是否stage使用，避免在DisplayObject里面require#stage
			this.stage = true;

			this._eventTarget = null;

			props = props || {};
			Stage.superclass.initialize.call(this, props);
			this.id = props.id || utils.createUID('Stage');
			if (this.context == null) throw 'Stage Error: context is required.';

			this.updatePosition();
		},
		/**
		 * 更新舞台Stage上的所有显示对象。
		 */
		step: function(timeInfo) {
			if (this.paused) return;
			this._update(timeInfo);
			this._render(this.context);
		},
		/**
		 * 更新舞台Stage上所有显示对象的数据。
		 */
		_update: function(timeInfo) {
			//Stage作为根容器，先更新所有子对象，再调用update方法。
			var copy = this.children.slice(0);
			for (var i = 0, len = copy.length; i < len; i++) {
				var child = copy[i];
				child._depth = i + 1;
				child._update(timeInfo);
			}
			if (this.update != null) this.update(timeInfo);
		},
		/**
		 * 渲染舞台Stage上的所有显示对象。
		 */
		_render: function(context) {
			if (context.clear != null) context.clear(0, 0, this.width, this.height);
			Stage.superclass._render.call(this, context);
		},
		/**
		 * 舞台Stage默认的事件处理器。
		 */
		dispatchEvent: function(e) {
			var x = e.pageX || e.clientX, y = e.pageY || e.clientY;
			x = (x - this.stageX) / this.scaleX;
			y = (y - this.stageY) / this.scaleY;
			var obj = this.getObjectUnderPoint(x, y, true), target = this._eventTarget;

			e.eventX = x;
			e.eventY = y;

			var leave = e.type == 'mouseout' && !this.context.canvas.contains(e.relatedTarget);
			if (target != null && (target != obj || leave)) {
				e.lastEventTarget = target;
				//派发移开事件mouseout或touchout到上一个事件对象
				var outEvent = (leave || obj == null || e.type == 'mousemove') ? 'mouseout' : e.type == 'touchmove' ? 'touchout' : null;
				if (outEvent) target.dispatchEvent({type: outEvent});
				this._eventTarget = null;
			}

			//派发事件到目标对象
			if (obj != null && obj.eventEnabled && e.type != 'mouseout') {
				e.eventTarget = target = this._eventTarget = obj;
				obj.dispatchEvent(e);
			}

			//设置光标状态
			if (utils.supportTouch) {
				var cursor = (target && target.useHandCursor && target.eventEnabled) ? 'pointer' : '';
				this.context.canvas.style.cursor = cursor;
			}

			if (leave || e.type != 'mouseout') Stage.superclass.dispatchEvent.call(this, e);
		},
		/**
		 * 更新舞台Stage在页面中的偏移位置，即stageX/stageY。
		 */
		updatePosition: function() {
			var offset = iGame.getElementOffset(this.context.canvas);
			this.stageX = offset.left;
			this.stageY = offset.top;
		}
	});

	return Stage;
});