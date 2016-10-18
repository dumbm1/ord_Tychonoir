(function symbToPng300dpi () {
  var d     = activeDocument,
      symbs = d.symbolItems,
      i;

  var symbInfo = _getArtbSize ();
  var tmpDocs  = [];

  for (i = 0; i < Math.ceil (symbInfo[2] / 100); i++) {
    tmpDocs.push (documents.add ());
  }



  function _getArtbSize () {
    var symbInfo;

    executeMenuCommand ('deselectall');

    for (i = 0; i < activeDocument.symbolItems.length; i++) {
      try {
        var symb      = activeDocument.symbolItems[i];
        symb.selected = true;
      } catch (e) {
      }
    }
    __runAction ('centerAlign', 'centerAlign', __actStr ());
    symbInfo = [selection[0].width, selection[0].height, selection.length];
    undo ();
    undo ();
    undo ();
    undo ();

    return symbInfo;

    function __runAction (actName, setName, actStr) {
      _makeAct (actStr);
      app.doScript (actName, setName, false); // action name, set name
      app.unloadAction (setName, ""); // set name

      function _makeAct (actStr) {
        var f = new File ('~/ScriptAction.aia');
        f.open ('w');
        f.write (actStr);
        f.close ();
        app.loadAction (f);
        f.remove ();
      }
    }

    function __actStr () {
      return '/version 3' +
        '/name [ 11' +
        '	63656e746572416c69676e' +
        ']' +
        '/isOpen 0' +
        '/actionCount 1' +
        '/action-1 {' +
        '	/name [ 11' +
        '		63656e746572416c69676e' +
        '	]' +
        '	/keyIndex 0' +
        '	/colorIndex 0' +
        '	/isOpen 0' +
        '	/eventCount 3' +
        '	/event-1 {' +
        '		/useRulersIn1stQuadrant 0' +
        '		/internalName (ai_plugin_alignPalette)' +
        '		/localizedName [ 9' +
        '			416c69676e6d656e74' +
        '		]' +
        '		/isOpen 1' +
        '		/isOn 1' +
        '		/hasDialog 0' +
        '		/parameterCount 1' +
        '		/parameter-1 {' +
        '			/key 1954115685' +
        '			/showInPalette -1' +
        '			/type (enumerated)' +
        '			/name [ 23' +
        '				486f72697a6f6e74616c20416c69676e2043656e746572' +
        '			]' +
        '			/value 2' +
        '		}' +
        '	}' +
        '	/event-2 {' +
        '		/useRulersIn1stQuadrant 0' +
        '		/internalName (ai_plugin_alignPalette)' +
        '		/localizedName [ 9' +
        '			416c69676e6d656e74' +
        '		]' +
        '		/isOpen 1' +
        '		/isOn 1' +
        '		/hasDialog 0' +
        '		/parameterCount 1' +
        '		/parameter-1 {' +
        '			/key 1954115685' +
        '			/showInPalette -1' +
        '			/type (enumerated)' +
        '			/name [ 21' +
        '				566572746963616c20416c69676e2043656e746572' +
        '			]' +
        '			/value 5' +
        '		}' +
        '	}' +
        '	/event-3 {' +
        '		/useRulersIn1stQuadrant 0' +
        '		/internalName (adobe_group)' +
        '		/localizedName [ 5' +
        '			47726f7570' +
        '		]' +
        '		/isOpen 0' +
        '		/isOn 1' +
        '		/hasDialog 0' +
        '		/parameterCount 0' +
        '	}' +
        '}'
    }
  }
  /**
   *
   * @param [Object/Collection]
   * @return {Array} [ bounds, width, height ]
   */
  function getSelBoundsExtend ( selectElems ) {

    var bounds = _getBounds ( selectElems, [] ),
        width  = _calcElemWidthByBounds ( bounds ),
        height = _calcElemHeightByBounds ( bounds );

// рекурсивный поиск максимально раздвинутых границ
    function _getBounds ( collection, bounds ) {
// если передана не коллекция а 1 контур
      if ( collection.typename == 'PathItem' || collection.typename == 'CompoundPathItem' ) {
        return collection.geometricBounds;
      }

      for ( var j = 0; j < collection.length; j++ ) {

        var el = collection [ j ];

        if ( el.typename != 'GroupItem' ) { // любой pageItem кроме группы
          if ( bounds == '' ) {
            bounds = el.geometricBounds;

            continue;
          }
          bounds = _compareBounds ( el, bounds );

        }

        if ( el.typename == 'GroupItem' && el.clipped ) { // группа с маской => ищем маску
          var groupPaths = el.pathItems;

          for ( var i = 0; i < groupPaths.length; i++ ) {
            if ( groupPaths[ i ].clipping ) {
              if ( bounds == '' ) {
                bounds = groupPaths[ i ].geometricBounds;

                continue;
              }
              bounds = _compareBounds ( groupPaths[ i ], bounds );

            }
          }
        }

        if ( el.typename == 'GroupItem' && !el.clipped && !el.groupItems ) { // группа без маски и без групп
          if ( bounds == '' ) {
            bounds = el.geometricBounds;

            continue;
          }
          bounds = _compareBounds ( el.geometricBounds, bounds );

        }

        if ( el.typename == 'GroupItem' && !el.clipped && el.groupItems ) { // группа без маски, но с группами => рекурсия
          bounds = _getBounds ( el.pageItems, bounds );

          continue;
        }
      }
      return bounds;
    }

// сравнить и вернуть самые широкие geometricBounds
    function _compareBounds ( elem, boundsToCompare ) {

      var elemBounds = elem.geometricBounds;

      return [
        Math.min(elemBounds[0], boundsToCompare[0]),
        Math.max(elemBounds[1],boundsToCompare[1]),
        Math.max(elemBounds[2],boundsToCompare[2]),
        Math.min(elemBounds[3],boundsToCompare[3])
      ]
    }

// высчитать ширину элемента по его левой и правой границе
    function _calcElemWidthByBounds ( bounds ) {
      var elemWidth = 0,
          left      = bounds[ 0 ],
          right     = bounds[ 2 ];

      (left <= 0 && right <= 0) || (left >= 0 && right >= 0) ? elemWidth = Math.abs ( left - right ) : '';
      left <= 0 && right >= 0 ? elemWidth = Math.abs ( left ) + right : '';

      return elemWidth;
    }

// высчитать высоту элемента по его верхней и нижней границе
    function _calcElemHeightByBounds ( bounds ) {
      var elemHeight = 0,
          top        = bounds[ 1 ],
          bottom     = bounds[ 3 ];

      (top <= 0 && bottom <= 0) || (top >= 0 && bottom >= 0) ? elemHeight = Math.abs ( top - bottom ) : '';
      top >= 0 && bottom <= 0 ? elemHeight = top + Math.abs ( bottom ) : '';
      return elemHeight;
    }

    return [ bounds, width, height ];
  }
} ());
