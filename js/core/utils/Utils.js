/**
 * Created with JetBrains WebStorm.
 * User: zero7u
 * Date: 13-6-26
 * Time: 下午2:33
 * To change this template use File | Settings | File Templates.
 */
define(function() {
  var Utils = {};

  Utils._counter = 0;

  Utils.createUID = function(name) {
    var charCode = name.charCodeAt(name.length - 1);
    if (charCode >= 48 && charCode <= 57) name += '_';
    return name + this._counter++;
  };

  Utils.displayObjectToString = function(displayObject) {
    var result;
    for (var o = displayObject; o != null; o = o.parent) {
      var s = o.id != null ? o.id : o.name;
      result = result == null ? s : (s + '.' + result);
      if (o == o.parent) break;
    }
    return result;
  };

  Utils.merge = function(obj, props, strict)
  {
    for(var key in props)
    {
      if(!strict || obj.hasOwnProperty(key) || obj[key] !== undefined) obj[key] = props[key];
    }
    return obj;
  };
  return Utils;
});
