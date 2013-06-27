define(function(require) {
  
  var Utils = {};

  Utils._counter = 0;

  /**
   * 根据指定名字生成一个全局唯一的ID，如Stage1，Bitmap2等。
   */
  Utils.createUID = function(name) {
    var charCode = name.charCodeAt(name.length - 1);
    if (charCode >= 48 && charCode <= 57) name += '_';
    return name + this._counter++;
  };

  /**
   * 转化命名格式为驼峰式。
   * @param {String} str 字符串。格式为"foo-bar"。
   */
  Utils.camelCase = function(str) {
    return str.replace(/-([a-z])/ig, function(all, letter) {
      return letter.toUpperCase();
    });
  };

  /**
   * 判断val是否是对象。
   * @param  {*} val
   * @return {Boolean}
   */
  Utils.isObject = function(val) {
    return val === Object(val);
  };

  /**
   * 判断val是否是函数。
   * @param  {Object} val
   * @return {Boolean}
   */
  Utils.isFunction = function(val) {
    return toString.call(val) === '[object Function]';
  };

  /**
   * 判断val是否是数组。
   * @param  {Object} val
   * @return {Boolean}
   */
  Utils.isArray = function(val) {
    return toString.call(val) == '[object Array]';
  };

  /**
   * 判断对象是否为空对象。
   * @param  {Object} obj
   * @return {int} 返回对象包含的属性数。
   */
  Utils.isEmptyObject = function(obj) {
    var i = 0, p;
    for (p in obj) {
      if (obj.hasOwnProperty(p)) i++;
    }
    return i;
  };

  /**
   * 为指定的displayobject显示对象生成一个包含路径的字符串表示形式。如Stage1.Container2.Bitmap3。
   */
  Utils.displayObjectToString = function(displayObject) {
    var result;
    for (var o = displayObject; o != null; o = o.parent) {
      var s = o.id != null ? o.id : o.name;
      result = result == null ? s : (s + '.' + result);
      if (o == o.parent) break;
    }
    return result;
  };

  /**
   * 获取URL参数。
   * @return {Object} 包含URL参数的键值对对象。
   */
  Utils.getUrlParams = function() {
    var params = {};
    var url = window.location.href;
    var idx = url.indexOf('?');
    if (idx > 0) {
      var queryStr = url.substring(idx + 1);
      var args = queryStr.split('&');
      for (var i = 0, a, nv; a = args[i]; i++) {
        nv = args[i] = a.split('=');
        params[nv[0]] = nv.length > 1 ? nv[1] : true;
      }
    }
    return params;
  };

  /**
   * 动态添加meta到head中。
   */
  Utils.addMeta = function(props) {
    var meta = document.createElement('meta');
    for (var p in props) meta.setAttribute(p, props[p]);
    head.insertBefore(meta, metaAfterNode);
  };

  /**
   * 显示或关闭舞台上所有显示对象的外包围矩形。此方法主要用于调试物体碰撞区域等。
   * @param  {Stage} stage
   */
  Utils.toggleDebugRect = function(stage) {
    stage.debug = !stage.debug;
    if (stage.debug) {
      stage._render = function(context) {
        if (context.clear != null) context.clear(0, 0, stage.width, stage.height);
        // Stage.superclass._render.call(stage, context);
        stage.constructor.superclass._render.call(stage, context);

        var ctx = stage.context.context;
        if (ctx != null) {
          ctx.save();
          ctx.lineWidth = 1;
          ctx.strokeStyle = '#f00';
          ctx.globalAlpha = 0.5;
        }
        drawObjectRect(stage, ctx);
        if (ctx != null) ctx.restore();
      };
    } else {
      stage._render = function(context) {
        if (context.clear != null) context.clear(0, 0, stage.width, stage.height);
        // Stage.superclass._render.call(stage, context);
        stage.constructor.superclass._render.call(stage, context);
      };
    }
  };

  /**
   * 把DisplayObject对象绘制到一个新的画布上。可作为缓存使用，也可转换成dataURL格式的位图。
   * @param {DisplayObject} obj 要缓存的显示对象。
   * @param {Boolean} toImage 指定是否把缓存转为DataURL格式的。默认为false。
   * @param {String} type 指定转换为DataURL格式的图片mime类型。默认为"image/png"。
   * @return {Object} 显示对象的缓存结果。根据参数toImage不同而返回Canvas或Image对象。
   */
  Utils.cacheObject = function(obj, toImage, type) {
    var w = obj.width, h = obj.height, mask = obj.mask;
    var canvas = Utils.createDOM('canvas', {width: w, height: h});
    var context = new CanvasContext({canvas: canvas});
    obj.mask = null;
    obj.render(context);
    obj.mask = mask;

    if (toImage) {
      var img = new Image();
      img.width = w;
      img.height = h;
      img.src = canvas.toDataURL(type || 'image/png');
      return img;
    }
    return canvas;
  };

  /**
   * 简单的log方法。同console.log。
   */
  Utils.log = function() {
    var logs = Array.prototype.slice.call(arguments);
    if (typeof console != 'undefined' && typeof(console.log) != 'undefined') {
      console.log(logs.join(' '));
    }
  };




  /**
   * 绘制显示对象的外围矩形
   * @private
   * @param  {DisplayObject} obj
   * @param  {Context} ctx
   */
  function drawObjectRect(obj, ctx) {
    for (var i = 0; i < obj.children.length; i++) {
      var child = obj.children[i];
      if (child.children) {
        drawObjectRect(child, ctx);
      } else {
        if (ctx != null) {
          var b = child.getBounds();

          ctx.globalAlpha = 0.2;
          ctx.beginPath();
          var p0 = b[0];
          ctx.moveTo(p0.x - 0.5, p0.y - 0.5);
          for (var j = 1; j < b.length; j++) {
            var p = b[j];
            ctx.lineTo(p.x - 0.5, p.y - 0.5);
          }
          ctx.lineTo(p0.x - 0.5, p0.y - 0.5);
          ctx.stroke();
          ctx.closePath();
          ctx.globalAlpha = 0.5;

          ctx.beginPath();
          ctx.rect((b.x>>0)-0.5, (b.y>>0)-0.5, b.width>>0, b.height>>0);
          ctx.stroke();
          ctx.closePath();
        } else {
          if (child.drawable.domDrawable) child.drawable.domDrawable.style.border = '1px solid #foo';
        }
      }
    }
  };

  return Utils;
});
