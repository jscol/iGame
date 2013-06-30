var uri = location.href;
uri = uri.substr(0, uri.lastIndexOf('/') + 1);
seajs.config({
  base: uri + 'src/base/',

  charset: 'utf-8',
  timeout: 20000,
  debug: 1
});
