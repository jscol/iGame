define(function(require) {
	var utils = require('utils/Utils');
	var DisplayObject = require('display/DisplayObject');

	/**
	 * Bitmap类
	 * @name { Bitmap:[name]}
	 * @augments {DisplayObject}
	 * @class Bitmap位图类，表示位图图像的显示对象，简单说它就是Image对象的某个区域的抽象表示。
	 * @param {Object} props 一个对象，包含以下属性：
	 * <p>image - Image对象。</p>
	 * <p>rect - Image对象的矩形区域。格式为：[0,0,100,100]</p>                                                                                  [description]
	 */
	var Bitmap = DisplayObject.extend({
		initialize: function(props) {
			this.image = null;
			this.rectX = 0;
			this.rectY = 0;
			this.rectWidth = 0;
			this.rectHeight = 0;

			props = props || {};
			Bitmap.superclass.initialize.call(this, props);
			this.id = props.id || utils.createUID('Bitmap');

			this.setRect(props.rect || [0, 0, this.image.width, this.image.height]);
			this.setDrawable(this.image);
			this._stateList.push('rectX', 'rectY', 'rectWidth', 'rectHeight');
		},
		/**
		 * 设置Bitmap对象的image的显示区域。
		 * @param {Array} rect 要设置的显示区域数组。格式为：[rectX, rectY, rectWidth, rectHeight]。
		 */
		setRect: function(rect) {
			this.rectX = rect[0];
			this.rectY = rect[1];
			this.rectWidth = this.width = rect[2];
			this.rectHeight = this.height = rect[3];
		},
		/**
		 * 重写父类的渲染方法。渲染image指定的显示区域。
		 * @param {Context} context 渲染上下文。
		 */
		render: function(context) {
			context.draw(this, this.rectX, this.rectY, this.rectWidth, this.rectHeight, 0, 0, this.width, this.height);
		}
	});

	return Bitmap;
});