/**
 * ai.jsx (c)MaratShagiev m_js@bk.ru 19.10.2016

 expSybolsToPng v0.1
 Illustrator CS6+
 * */
//@target illustrator
(function expSymbolsToPng (res) {
  var i, j,
      d          = activeDocument,
      folderPath = d.path,
      fileName   = d.name.slice (0, d.name.lastIndexOf ('.')),
      fullPath   = folderPath + '/' + fileName;

  _arrangeSymb ();
  _saveAsPdf (fullPath);
  _expToPng (fullPath, res);

  function _saveAsPdf (fullPath) {
    var pdfSaveOpts               = new PDFSaveOptions (),
        f                         = new File (fullPath);
    pdfSaveOpts.PDFPreset         = '[Illustrator Default]';
    pdfSaveOpts.colorConversionID = ColorConversion.COLORCONVERSIONREPURPOSE;
    pdfSaveOpts.viewAfterSaving   = false;
    activeDocument.saveAs (f, pdfSaveOpts);
  }

  function _expToPng (fullPath) {
    sendBt ();

    function sendBt () {
      var bt       = new BridgeTalk ();
      bt.target    = 'photoshop';
      bt.body      = _make.toString () +
        ';_make("' + fullPath + '","' + activeDocument.artboards.length + '","' + res + '");';
      bt.timeout   = 1200;
      bt.onTimeout = function () {
        sendBt ();
      }
      return bt.send ();
    }

    function _make (fullPath, artbLen, res) {

      app.displayDialogs = DialogModes.NO;

      var pdfFile     = new File (fullPath + '.pdf'),
          pngPath,
          pdfOpenOpts = new PDFOpenOptions,
          pngSaveOpts = new PNGSaveOptions ();

      pdfOpenOpts.usePageNumber        = true;
      pdfOpenOpts.resolution           = res;
      pdfOpenOpts.antiAlias            = true;
      pdfOpenOpts.bitsPerChannel       = BitsPerChannelType.EIGHT;
      pdfOpenOpts.cropPage             = CropToType.CROPBOX;
      pdfOpenOpts.mode                 = OpenDocumentMode.RGB;
      pdfOpenOpts.suppressWarnings     = true;
      pdfOpenOpts.constrainProportions = true;

      try {
        for (var i = 1; i < artbLen + 1; i++) {
          ( i < 10 ) ? pngPath = fullPath + '-0' + i : pngPath = fullPath + '-' + i;
          pdfOpenOpts.page = i;
          app.open (pdfFile, pdfOpenOpts);
          app.activeDocument.saveAs (new File (pngPath), pngSaveOpts, true);
          app.activeDocument.close (SaveOptions.DONOTSAVECHANGES);
        }
      } catch (e) {
      } finally {
        pdfFile.remove ();
      }
    }
  }

  function _arrangeSymb () {
    var sbH     = 0,
        sbW     = 0,
        symbols = [],
        pdfDoc,
        abSpace = 10,
        abRect;

    executeMenuCommand ('deselectall');

    for (i = 0; i < 100; i++) {
      try {
        var symb      = activeDocument.symbolItems[i];
        symb.selected = true;
        sbH           = Math.max (sbH, symb.height);
        sbW           = Math.max (sbW, symb.width);
        symbols.push (symb);
      } catch (e) {
      }
    }

    copy ();

    pdfDoc = documents.add (
      DocumentColorSpace.RGB, sbW, sbH, symbols.length, DocumentArtboardLayout.RLGridByRow, abSpace, 10
    );
    paste ();
    executeMenuCommand ('deselectall');

    for (i = 0; i < activeDocument.artboards.length; i++) {
      activeDocument.artboards.setActiveArtboardIndex (i);
      activeDocument.rulerOrigin = activeDocument.artboards[i].rulerOrigin;
      symb                       = activeDocument.symbolItems[i];
      abRect                     = activeDocument.artboards[i].artboardRect;
      symb.position              = [(sbW - symb.width) / 2, -(-sbH - symb.height) / 2];
    }

    for (i = 0; i < activeDocument.artboards.length; i++) {
      activeDocument.artboards.setActiveArtboardIndex (i);
      activeDocument.selectObjectsOnActiveArtboard ();
      executeMenuCommand ('Fit Artboard to selected Art');
    }
  }

} (300));