define(function(require) {
	var Class = require('core/Class');
	var Base = require('core/Base');

	/** @lends Context */
	var Context = Class.create({
		/**
		 * @name Context
		 * @class  Context是显示对象结构的上下文，实现显示对象结构的渲染。此类为抽象类。
		 * @constructor
		 * @extends {Class} Class
		 * @param {Object} props 一个对象。包含以下属性：
		 * <p>canvas - 渲染上下文所对应的画面。</p>
		 */
		initialize: function(props) {
			if (props.canvas == null) throw 'Context Error: canvas is required.';
			this.canvas = null;
			Base.merge(this, props);
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