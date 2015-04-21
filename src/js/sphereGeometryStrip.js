/*jslint node: true */
"use strict";

var widgetGeometry = {
  vertexPositions: [],
  vertexNormals: [],
  vertexTextureCoords: [],
  indices: [],
  colors: []
};

function upStrip(rows, start) {
  var idxTriStrip = [];
  for (var i = start, r = 0; r < rows; r++) {
    idxTriStrip[2 * r] = r + start;
    idxTriStrip[2 * r + 1] = r + start + rows;
  }
  return idxTriStrip;
}

function dnStrip(rows, start) {
  var idxTriStrip = [];
  var o = 0;
  for (var i = start, r = rows; r > 0; r--) {
    idxTriStrip[o++] = r + start - rows;
    idxTriStrip[o++] = r + start;
  }
  return idxTriStrip;
}

function makePlane(size, rows) {
  var step = size / (rows - 1);
  var i = 0, s = size / 2;
  var t = [];
  for (var x = 0; x < rows; x++) {
    for (var y = 0; y < rows; y++) {
      t[i++] = -s + x * step;
      t[i++] = -s + y * step;
      t[i++] = 0;//-s;
    }
  }
  return t;
}

function initGeometry(size, rows) {
  size = size || 7;
  rows = rows || 16;

  var v = makePlane(size, rows);
  var idxTriStrip = upStrip(rows, 0);
  if (rows & 1 === 1) {
    for (var i = 1; i < rows / 2 - 1; i++) {
      idxTriStrip = idxTriStrip.concat(dnStrip(rows, idxTriStrip.slice(-1)[0]));
      idxTriStrip = idxTriStrip.concat(upStrip(rows, idxTriStrip.slice(-1)[0]));
    }
    idxTriStrip = idxTriStrip.concat(dnStrip(rows, idxTriStrip.slice(-1)[0]));
  } else {
    for (var i = 1; i < rows / 2; i++) {
      idxTriStrip = idxTriStrip.concat(dnStrip(rows, idxTriStrip.slice(-1)[0]));
      idxTriStrip = idxTriStrip.concat(upStrip(rows, idxTriStrip.slice(-1)[0]));
    }
  }
  var idxAllTris = idxTriStrip.slice();

  var step = idxAllTris.slice(-1)[0] + 1 === v.length / 3 ? -1 : 1;
  var i = idxAllTris.slice(-1)[0] + 1;
  for (var j = 0; j < rows; j++) {
    for (var k = 0; k < rows; k++) {
      i += step;
      idxAllTris.push(i);
    }
    i -= rows - step;
    step = -step;
  }

  for (var i = 0; i < v.length/3; i++) {
    widgetGeometry.colors.push(0); widgetGeometry.colors.push(0); widgetGeometry.colors.push(0); widgetGeometry.colors.push(0);
    widgetGeometry.vertexNormals.push(0); widgetGeometry.vertexNormals.push(0); widgetGeometry.vertexNormals.push(0);
    widgetGeometry.vertexTextureCoords.push(0); widgetGeometry.vertexTextureCoords.push(0);
  }

  //var widgetGeom = new widgetGeometry();
  //widgetGeometry.vertexPositions = new Float32Array(v);
  //widgetGeometry.indices = new Uint16Array(idxTriStrip);
  widgetGeometry.vertexPositions = v;
  widgetGeometry.indices = idxTriStrip;

  return widgetGeometry;
}
