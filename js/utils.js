﻿// kitchen sink for useful functions, tut tut

function pushMatrix(matrixStack, matrix) {
  var copy = mat4.create();
  mat4.set(matrix, copy);
  matrixStack.push(copy);
}
function popMatrix(matrixStack) {
  if (mvMatrixStack.length == 0) {
    throw "Invalid popMatrix!";
  }
  return matrixStack.pop();
}

function degToRad(degrees) {
  return degrees * Math.PI / 180;
}

function getPowerOfTwo(value, pow) {
  var pow = pow || 1;
  while (pow < value) {
    pow *= 2;
  }
  return pow;
}

function clone(obj) {
  if (null == obj || "object" != typeof obj) return obj;
  var copy = obj.constructor();
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
  }
  return copy;
}

function initShaderProgram(vName, fName) {
  var v = document.getElementById(vName).firstChild.nodeValue;
  var f = document.getElementById(fName).firstChild.nodeValue;

  var vs = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vs, v);
  gl.compileShader(vs);

  var fs = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fs, f);
  gl.compileShader(fs);

  var shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vs);
  gl.attachShader(shaderProgram, fs);
  gl.linkProgram(shaderProgram);

  if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) console.log(gl.getShaderInfoLog(vs));

  if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) console.log(gl.getShaderInfoLog(fs));

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) console.log(gl.getProgramInfoLog(shaderProgram));

  gl.useProgram(shaderProgram);

  return shaderProgram
}

// shamelessly riped off from http://delphic.me.uk/webgltext.html
function measureText(ctx, textToMeasure) {
  return ctx.measureText(textToMeasure).width;
}

function createMultilineText(ctx, textToWrite, maxWidth, text) {
  textToWrite = textToWrite.replace("\n", " ");
  var currentText = textToWrite;
  var futureText;
  var subWidth = 0;
  var maxLineWidth = 0;

  var wordArray = textToWrite.split(" ");
  var wordsInCurrent, wordArrayLength;
  wordsInCurrent = wordArrayLength = wordArray.length;

  // Reduce currentText until it is less than maxWidth or is a single word
  // futureText var keeps track of text not yet written to a text line
  while (measureText(ctx, currentText) > maxWidth && wordsInCurrent > 1) {
    wordsInCurrent--;
    var linebreak = false;

    currentText = futureText = "";
    for (var i = 0; i < wordArrayLength; i++) {
      if (i < wordsInCurrent) {
        currentText += wordArray[i];
        if (i + 1 < wordsInCurrent) { currentText += " "; }
      }
      else {
        futureText += wordArray[i];
        if (i + 1 < wordArrayLength) { futureText += " "; }
      }
    }
  }
  text.push(currentText); // Write this line of text to the array
  maxLineWidth = measureText(ctx, currentText);

  // If there is any text left to be written call the function again
  if (futureText) {
    subWidth = createMultilineText(ctx, futureText, maxWidth, text);
    if (subWidth > maxLineWidth) {
      maxLineWidth = subWidth;
    }
  }

  // Return the maximum line width
  return maxLineWidth;
}

function writeStringToCanvas(string, canvas) {
  ctx = canvas.getContext('2d');
  var text = [];
  var textX, textY;
  var textToWrite = string;
  var textHeight = 32;
  var maxWidth = 256;

  ctx.font = textHeight + "px monospace";
  maxWidth = createMultilineText(ctx, textToWrite, maxWidth, text);

  canvas.width = getPowerOfTwo(maxWidth);
  canvas.height = getPowerOfTwo(textHeight * (text.length + 1));
  ctx.font = textHeight + "px monospace";
  canvasX = canvas.width;
  canvasY = canvas.height;

  ctx.fillStyle = "#0";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  textX = canvasX / 2;
  var offset = (canvasY - textHeight * (text.length + 1)) * 0.5;

  for (var i = 0; i < text.length; i++) {
    textY = (i + 1) * textHeight + offset;
    ctx.fillText(text[i], textX, textY);
  }
}