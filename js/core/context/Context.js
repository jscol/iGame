define(function(require) {
	var Class = require('lib/class');
	var iGame = require('core/iGame');

	/**
	 * @name {Context:[name]}
	 * @class  Context是显示对象结构的上下文，实现显示对象结构的渲染。此类为抽象类。
	 * @param {Object} props 一个对象。包含以下属性：
	 * <p>canvas - 渲染上下文所对应的画面。</p>
	 */
	var Context = Class.create({
		initialize: function(props) {
			if (props.canvas == null) throw 'Context Error: canvas is required.';
			this.canvas = null;
			iGame.merge(this, props);
		},

		/**
		 * 为开始绘制显示对象做准备。
		 */
		startDraw: function() {},

		/**
		 * 绘制显示对象。
		 */
		draw: function() {},

		/**
		 * 完成绘制显示对象后的处理方法。
		 */
		endDraw: function() {},

		/**
		 * 对显示对象进行变换。
		 */
		transform: function() {},

		/**
		 * 从画布中删除显示对象。
		 * @param {DisplayObject} target 要删除的显示对象。
		 */
		remove: function(target) {}
	});

	return Context;
});