//@target illustrator-19
(function symbToPng300dpi () {
  var i, j,
      sbH     = 0,
      sbW     = 0,
      symbols = [],
      pdfDoc,
      abSpace = 10,
      abL, abR, abT, abB,
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
    activeDocument.selectObjectsOnActiveArtboard();
    executeMenuCommand ('Fit Artboard to selected Art');
  }

} ());
