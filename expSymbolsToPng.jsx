/**
 * ai.jsx (c)MaratShagiev m_js@bk.ru 19.10.2016

 expSybolsToPng v0.2
 Illustrator CS6+
 * */
//@target illustrator
(function expSymbolsToPng () {
  var i, j,
      d          = activeDocument,
      folderPath = d.path,
      fileName   = d.name.slice (0, d.name.lastIndexOf ('.')),
      fullPath   = folderPath + '/' + fileName,
      sbH        = 0,
      sbW        = 0,
      symbols    = [],
      pdfDoc,
      abSpace    = 10,
      abRect,
      pngOpts    = new ExportOptionsPNG24 ();

  pngOpts.artBoardClipping = true;
  pngOpts.horizontalScale  = 416.67;
  pngOpts.verticalScale    = 416.67;

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

  for (i = 0; i < activeDocument.artboards.length; i++) {
    activeDocument.artboards.setActiveArtboardIndex (i);
    activeDocument.exportFile (new File (fullPath + ' ' + i + '.png'), ExportType.PNG24, pngOpts);
  }

} ());
