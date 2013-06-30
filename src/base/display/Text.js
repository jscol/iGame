define(function(require) {
	var Base = require('core/Base');
	var utils = require('utils/Utils');
	var DisplayObject = require('display/DisplayObject');

	/** @lends Text */
	var Text = DisplayObject.extend({
		/**
		 * @name Text
		 * @class Text类提供简单的文字显示功能。
		 * @constructor
		 * @extends {DisplayObject} DisplayObject
		 * @property text 指定要显示的文本内容。
		 * @property font 指定使用的字体样式。
		 * @property color 指定使用的字体颜色。
		 * @property textAlign 指定文本的对齐方式。如："start"，"end"，"left"，"right，"and "center"。
		 * @property outline 指定文本是绘制边框还是填充。
		 * @property maxWidth 指定文本绘制的最大宽度。
		 * @property lineWidth 指定文本行的最大宽度。
		 * @property lineSpacing 指定文本的行距。
		 * @property fontMetrics 指定字体的试题对象。
		 */
		initialize: function(props) {
			this.text = '';
			this.font = '12px arial';
			this.color = '#000';
			this.textAlign = 'start';
			this.outline = false;
			this.maxWidth = 10000;
			this.lineWidth = null;
			this.lineSpacing = 0;
			this.fontMetrics = null;

			props = props || {};
			Text.superclass.initialize.call(this, props);
			this.id = utils.createUID('Text');

			if (this.fontMetrics == null) this.fontMetrics = Text.getFontMetrics(this.font);
		},
		/**
		 * 在指定的渲染上下文上绘制文本。
		 * @private
		 */
		_draw: function(context) {
			if (!this.text || this.text.length == 0) return;

			context.font = this.font;
			context.textAlign = this.textAlign;
			context.textBaseline = 'top';
			if (this.outline) context.strokeStyle = this.color;
			else context.fillStyle = this.color;

			//find adn draw all explicit lines
			var lines = this.text.split(/\r\n|\r|\n|<br(?:[ \/])*>/);
			var y = 0, lineHeight = this.fontMetrics.height + this.lineSpacing;
			this.width = this.lineWidth || 0;

			for (var i = 0, len = lines.length; i < len; i++) {
				var line = lines[i], width = context.measureText(line).width;

				//check if the line need to split
				if (this.lineWidth == null || width < this.lineWidth) {
					if (width > this.width) this.width = width;
					this._drawTextLine(context, line, y);
					y += lineHeight;
					continue;
				}

				//split the line by each single word, loop to find the break
				var words = line.split(/([^\x00-\xff]|\b)/), str = words[0];
				for (var j = 1, wlen = words.length; j < wlen; j++) {
					var word = words[j];
					if (!word || word.length == 0) continue;

					var newWidth = context.measureText(str + word).width;
					if (newWidth > this.lineWidth) {
						this._drawTextLine(context, str, y);
						y += lineHeight;
						str = word;
					} else {
						str += word;
					}
				}

				//draw remaining string
				this._drawTextLine(context, str, y);
				y += lineHeight;
			}

			this.height = y;
		},
		/**
		 * 在指定的渲染上下文上绘制一行文本。
		 */
		_drawTextLine: function(context, text, y) {
			var x = 0;
			switch (this.textAlign) {
				case 'center':
					x = this.width * 0.5;
					break;
				case 'right':
				case 'end':
					x = this.width;
					break;
			}
			if (this.outline) context.strokeText(text, x, y, this.maxWidth);
			else context.fillText(text, x, y, this.maxWidth);
		},
		/**
		 * 指定渲染文本的字体样式。
		 */
		setFont: function(font, ignoreFontMetrics) {
			if (this.font == font) return;
			this.font = font;
			if (!ignoreFontMetrics) this.fontMetrics = Text.getFontMetrics(this.font);
		},
		/**
		 * override method.
		 * @private
		 */
		getDrawable: function(context) {
			//for DOMContext drawing only
			if (this.drawable == null) this.setDrawable(Base.createDOM('div'), true);
			return this.drawable.get(this, context);
		},
		Statics: {
			/**
			 * 此方法可得到指定字体的街市、基准线等度量信息。
			 * @method getFontMetrics
			 * @return {Object} 返回字体的度量信息，包括height、ascent、descent等。
			 */
			getFontMetrics: function(font) {
				var metrics = {};
				var elem = Base.createDOM('div', {style: {font: font, position: 'absolute'}, innerHTML: 'M'});
				document.body.appendChild(elem);
				//the line height of the specific font style.
				metrics.height = elem.offsetHeight;

				//trick: calculate baseline shift by creating 1px height element that will be aligned to baseline.
				elem.innerHTML = '<div style="display:inline-block; width:1px; height:1px;"></div>';
				var baseline = elem.childNodes[0];
				//the ascent value is the length from the baseline to the top of the line height.
				metrics.ascent = baseline.offsetTop + baseline.offsetHeight;
				//the descent value is the length from the baseline to the bottom of the line height.
				metrics.descent = metrics.height - metrics.ascent;

				document.body.removeChild(elem);
				return metrics;
			}
		}
	});

	return Text;
})