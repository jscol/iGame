/**
 * Created with JetBrains WebStorm.
 * User: zero7u
 * Date: 13-6-26
 * Time: 上午9:52
 * To change this template use File | Settings | File Templates.
 */
var uri = location.href;
uri = uri.substr(0, uri.lastIndexOf('/') + 1);
seajs.config({
  base: uri + 'js/core/',
  alias: {
    'lib': uri + 'js/lib/'
  },
  charset: 'utf-8',
  timeout: 20000,
  debug: 1
});
