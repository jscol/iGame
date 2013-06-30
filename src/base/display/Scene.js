define(function(require) {
	var Base = require('core/Base');
	var utils = require('utils/Utils');
	var DisplayObjectContainer = require('display/DisplayObjectContainer');

	/** @lends Scene */
	var Scene = DisplayObjectContainer.extend({
		/**
		 * @name Scene
		 * @class Scene场景类。
		 * @constructor
		 * @extends {DisplayObjectContainer} DisplayObjectContainer
		 */
		initialize: function(props) {
			// this.stage = props.stage;
			
			props = props || {};
			Scene.superclass.initialize.call(this, props);
			this.id = props.id || utils.createUID('Scene');
		},
		/**
		 * 进入场景时调用的方法。
		 */
		onEnter: function() {},
		/**
		 * 鼠标按下回调函数。
		 */
		mousedown: function(e) {},
		/**
		 * 鼠标弹起回调函数。
		 */
		mouseup: function(e) {},
		/**
		 * 鼠标移动回调函数。
		 */
		mousemove: function(e) {}
	});

	return Scene;
});