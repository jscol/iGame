define(function(require) {
  var Class = require('core/Class');
  var Base = require('core/Base');

  /** @lends Drawable */
  var Drawable = Class.create({
    /**
     * @name Drawable
     * @class Drawable是可绘制图像或DOM的包装。当封装的是HTMLImageElement、HTMLCanvasElement或HTMLVideoElement对象时，可同时支持canvas和dom两种渲染方式，而如果封装的是dom时，则不支持canvas方式。
     * @constructor
     * @extends {Class} Class
     * @param drawable 一个可绘制对象。
     * @param {Boolean} isDOM 指定参数drawable是否为一个DOM对象。默认为false。
     */
    initialize: function(drawable, isDOM) {
      this.rawDrawable = null;
      this.domDrawable = null;
      this.set(drawable, isDOM);
    },
    /**
     * 根据context上下文获取不同的Drawable包装的对象。
     * @param  {DisplayObject} obj     指定的显示对象。
     * @param  {Context} context 指定的渲染上下文
     * @return {Drawable}         返回包装的可绘制对象。
     */
    get: function(obj, context) {
      if (context == null || context.canvas.getContext != null) {
        return this.rawDrawable;
      } else {
        if (this.domDrawable == null) {
          this.domDrawable = Base.createDOMDrawable(obj, {image: this.rawDrawable});
        }
        return this.domDrawable;
      }
    },
    /**
     * 设置Drawable对象。
     * @param  drawable 一个可绘制对象。
     * @param  {Boolean} isDOM    指定参数drawable是否为一个DOM对象。默认为false。
     */
    set: function(drawable, isDOM) {
      if (isDrawable(drawable)) this.rawDrawable = drawable;
      if (isDOM == true) {
        this.domDrawable = drawable;
      } else if (this.domDrawable) {
        this.domDrawable.style.backgroundImage = 'url(' + this.rawDrawable.src + ')';
      }
    }
  });

  function isDrawable(elem) {
    if (elem == null) return false;
    return (elem instanceof HTMLImageElement) ||
      (elem instanceof HTMLCanvasElement) ||
      (elem instanceof HTMLVideoElement);
  }

  return Drawable;
});