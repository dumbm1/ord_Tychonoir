/**
 * ai.jsx cs6+ (c)MaratShagiev m_js@bk.ru 19.10.2016
 *
 * captureSymbols
 * */
//@target illustrator
(function captureSymbols(res) {
  var d = activeDocument,
      pth  = d.fullName + '',
      opts = new ImageCaptureOptions();

  opts.resolution   = res;
  opts.antialiasing = true;
  opts.transparency = true;

  for (var i = 0; i < d.symbolItems.length; i++) {
    try {
      var symb      = d.symbolItems[i];
      symb.selected = true;
      symb.selected = false;
      d.imageCapture(
        new File(pth.slice(0, pth.lastIndexOf('.')) + '_' + i + '.png'),
        symb.geometricBounds,
        opts
      );
    } catch (e) {
    }
  }
}(300));
