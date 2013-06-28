define(function(require) {
	var iGame = require('core/iGame');
	var utils = require('utils/Utils');
	var Context = require('context/Context');
	var Graphics = require('display/Graphics');
	var Text = require('display/Text');
	var DisplayObjectContainer = require('display/DisplayObjectContainer');
	var Stage = require('display/Stage');

	/**
	 * @name {CanvasContext:[name]}
	 * @augments {Context}
	 * @class  CanvasContext是Canvas渲染上下文，将显示对象渲染到指定的Canvas上。
	 * @param {Object} props 一个对象。包含以下属性：
	 * <p>canvas - 渲染上下文所对应的canvas，HTMLCanvasElement对象。</p>
	 */
	var CanvasContext = Context.extend({
		initialize: function(props) {
			CanvasContext.superclass.initialize.call(this, props);
			this.context = this.canvas.getContext('2d');
		},
		Statics: {
			// instance: new CanvasContext({canvas: iGame.createDOM('canvas')})
		},
		/**
		 * 准备绘制，保存当前上下文。
		 */
		startDraw: function() {
			this.context.save();
		},
		/**
		 * 绘制指定的显示对象到canvas上。
		 * @param {DisplayObject} target 要绘制的显示对象。
		 */
		draw: function(target) {
			//ignore children drawing if the parent has a mask.
			if (target.parent != null && target.parent.mask != null) return;

			if (target.mask != null) {
				//we implements the mask function by using 'source-in' composite operation.
				//so can't draw objects with masks into this canvas directly.
				var w = target.width, h = target.height;
				var context = CanvasContext.instance, canvas = context.canvas, ctx = context.context;
				// canvas.width = 0;
				canvas.width = w;
				canvas.height = h;
				context.startDraw();
				target.mask._render(context);
				ctx.globalCompositeOperation = 'source-in';

				//this is a trick for ignoring mask drawing during object drawing.
				var mask = target.mask;
				target.mask = null;
				if (target instanceof DisplayObjectContainer) {
					//container's children should draw at once in 'souce-in' mode.
					var cache = target._cache || utils.cacheObject(target);
					ctx.drawImage(cache, 0, 0, w, h, 0, 0, w, h);
				} else {
					target.render(context);
				}
				context.endDraw();
				target.mask = mask;

				arguments[0] = canvas;
				this.context.drawImage.apply(this.context, arguments);				
			} else if (target._cache != null) {
				//draw cache if exist
				this.context.drawImage(target._cache, 0, 0);
			} else if (target instanceof Graphics || target instanceof Text) {
				//special drawing
				target._draw(this.context);
			} else {
				//normal draw
				var img = target.getDrawable(this);
				if (img != null) {
					arguments[0] = img;
					this.context.drawImage.apply(this.context, arguments);
				}
			}
		},
		/**
		 * 绘制完毕，恢复上下文。
		 */
		endDraw: function() {
			this.context.restore();
		},
		/**
		 * 对指定的显示对象进行context属性设置或变换。
		 * @param {DisplayObject} target 要进行属性设置或变换的显示对象。
		 */
		transform: function(target) {
			var ctx = this.context;

			if (target instanceof Stage) {
				//use style for stage scaling
				if (target._scaleX != target.scaleX) {
					target._scaleX = target.scaleX;
					this.canvas.style.width = target._scaleX * target.width + 'px';
				}
				if (target._scaleY != target.scaleY) {
					target._scaleY = target.scaleY;
					this.canvas.style.height = target._scaleY * target.height + 'px';
				}
			} else {
				if (target.x != 0 || target.y != 0) ctx.translate(target.x, target.y);
				if (target.rotation % 360 != 0) ctx.rotate(target.rotation % 360 * Math.DEG_TO_RAD);
				if (target.scaleX != 1 || target.scaleY != 1) ctx.scale(target.scaleX, target.scaleY);
				if (target.regX != 0 || target.regY != 0) ctx.translate(-target.regX, -target.regY);
			}

			if (target.alpha > 0) ctx.globalAlpha *= target.alpha;
		},
		/**
		 * 清除画布上的指定区域内容。
		 * @param {Number} x 指定区域的x轴坐标。
		 * @param {Number} y 指定区域的y轴坐标。
		 * @param {Number} width 指定区域的宽度。
		 * @param {Number} height 指定区域的高度。
		 */
		clear: function(x, y, width, height) {
			this.context.clearRect(x, y, width, height);
		}
	});

	CanvasContext.instance = new CanvasContext({canvas: iGame.createDOM('canvas')});

	return CanvasContext;
});