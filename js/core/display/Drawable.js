/**
 * Created with JetBrains WebStorm.
 * User: zero7u
 * Date: 13-6-26
 * Time: 下午4:37
 * To change this template use File | Settings | File Templates.
 */
define(function(require) {
  var Class = require('lib/class');

  var Drawable = Class.create({
    initialize: function(drawable, isDOM) {
      this.rawDrawable = null;
      this.domDrawable = null;
      this.set(drawable, isDOM);
    },
    get: function(obj, context) {
      if (context == null || context.canvas.getContext != null) {
        return this.rawDrawable;
      } else {
        if (this.domDrawable == null) {
          this.domDrawable = createDOMDrawable(obj, {image: this.rawDrawable});
        }
        return this.domDrawable;
      }
    },
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

  function createDOMDrawable(disObj, imageObj)
  {
    var tag = disObj.tagName || "div";
    var img = imageObj.image;
    var w = disObj.width || (img && img.width);
    var h =  disObj.height || (img && img.height);

    var elem = Quark.createDOM(tag);
    if(disObj.id) elem.id = disObj.id;
    elem.style.position = "absolute";
    elem.style.left = (disObj.left || 0) + "px";
    elem.style.top = (disObj.top || 0) + "px";
    elem.style.width = w + "px";
    elem.style.height = h + "px";

    if(tag == "canvas")
    {
      elem.width = w;
      elem.height = h;
      if(img)
      {
        var ctx = elem.getContext("2d");
        var rect = imageObj.rect || [0, 0, w, h];
        ctx.drawImage(img, rect[0], rect[1], rect[2], rect[3],
          (disObj.x || 0), (disObj.y || 0),
          (disObj.width || rect[2]),
          (disObj.height || rect[3]));
      }
    }else
    {
      elem.style.opacity = disObj.alpha != undefined ? disObj.alpha : 1;
      elem.style.overflow = "hidden";
      if(img && img.src)
      {
        elem.style.backgroundImage = "url(" + img.src + ")";
        var bgX = disObj.rectX || 0, bgY = disObj.rectY || 0;
        elem.style.backgroundPosition = (-bgX) + "px " + (-bgY) + "px";
      }
    }
    return elem;
  }

  return Drawable;
});