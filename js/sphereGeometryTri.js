/*jslint node: true */
"use strict";

var widgetGeometry = {
  vertexPositions: [],
  vertexNormals: [],
  vertexTextureCoords: [],
  indices: [],
  colors: [],
  emissiveColors: [],
  diffuseColors: [],
  specularColors: [],
};

function makePlane(size, rows) {
  var step = size / (rows - 1);
  var i = 0, s = size / 2;
  var t = [];
  for (var x = 0; x < rows; x++) {
    for (var y = 0; y < rows; y++) {
      var x1, y1, z1, r;
      x1 = -s + x * step;
      y1 = -s + y * step;
      z1 = -s;
      r = Math.sqrt(x1 * x1 + y1 * y1 + z1 * z1);

      //x1 /= r;
      //y1 /= r;
      //z1 /= r;

      t[i++] = x1;//-s + x * step;
      t[i++] = y1;//-s + y * step;
      t[i++] = z1;//-s;
    }
  }
  return t;
}

function initGeometry(size, rows) {
  size = size || 7;
  rows = rows || 16;

  var v = makePlane(size, rows);

  // determine quadrant limits
  var q1 = rows / 4;
  var q3 = (q1 - 1) * 3;
  q1++;

  for (var i = 0; i < rows - 1; i++) {
    for (var j = 0; j < rows - 1; j++) {
      if ((i < q1 && j < q1) || (i > q3 && j > q3)) {
        widgetGeometry.indices.push(i + j * rows + 1); // 1
        widgetGeometry.indices.push(i + j * rows);  // 0
        widgetGeometry.indices.push(i + (j + 1) * rows + 1); // 4

        widgetGeometry.indices.push(i + (j + 1) * rows + 1); // 4
        widgetGeometry.indices.push(i + (j + 1) * rows); // 3
        widgetGeometry.indices.push(i + j * rows);  // 0
      } else {
        widgetGeometry.indices.push(i + j * rows);  // 0
        widgetGeometry.indices.push(i + j * rows + 1); // 1
        widgetGeometry.indices.push(i + (j + 1) * rows); // 3

        widgetGeometry.indices.push(i + j * rows + 1); // 1
        widgetGeometry.indices.push(i + (j + 1) * rows); // 3
        widgetGeometry.indices.push(i + (j + 1) * rows + 1); // 4
      }
    }
  }

  var l = v.length;
  for (var i = 0; i < l; i += 3) {
    v.push(v[i + 1]);
    v.push(v[i]);
    v.push(-v[i + 2]);
  }

  appendIndices(widgetGeometry.indices.length, l / 3);

  // copy and append vertices rotated through 90 degrees
  l = v.length;
  for (var i = 0; i < l; i += 3) {
    v.push(v[i + 2]);
    v.push(v[i]);
    v.push(v[i + 1]);
  }
  appendIndices(widgetGeometry.indices.length, l / 3);

  for (var i = 0; i < l; i += 3) {
    v.push(v[i]);
    v.push(v[i + 2]);
    v.push(v[i + 1]);
  }
  appendIndices(widgetGeometry.indices.length/2, 2*l / 3);

  for (var i = 0; i < widgetGeometry.vertexPositions.length/3; i++) {
    widgetGeometry.colors.push(1); widgetGeometry.colors.push(1); widgetGeometry.colors.push(0); widgetGeometry.colors.push(1);
    //widgetGeometry.colors = widgetGeometry.emissiveColors;
    widgetGeometry.vertexNormals.push(0); widgetGeometry.vertexNormals.push(0); widgetGeometry.vertexNormals.push(0);
    widgetGeometry.vertexTextureCoords.push(0); widgetGeometry.vertexTextureCoords.push(0);
  }

  //var widgetGeom = new widgetGeometry();
  //widgetGeometry.vertexPositions = new Float32Array(v);
  //widgetGeometry.indicesStrip = new Uint16Array(idxTriStrip);
  widgetGeometry.vertexPositions = v;

  return widgetGeometry;
}

function appendIndices(limit, offset) {
  for (var i = 0; i < limit; i++) {
    widgetGeometry.indices.push(widgetGeometry.indices[i] + offset);
  }
}
