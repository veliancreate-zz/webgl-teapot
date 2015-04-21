function Geometry(options) {
  this.vertexPositions = [];
  this.vertexNormals = [];
  this.vertexTextureCoords = [];
  this.indices = [];
  // colours for each face
  this.ambientColors = [];
  this.emissiveColors = [];
  this.diffuseColors = [];
  this.specularColors = [];
  // single colour for all faces
  this.ambientMaterial = [];
  this.emissiveMaterial = [];
  this.diffuseMaterial = [];
  this.specularColor = [];

  if (options !== undefined) {
    for (var property in this) {
      if (this.hasOwnProperty(property)) {
        if (property in options) {
          this[property] = options[property];
        }
      }
    }

    // set XXXcolor = XXXcolors if not defined
    for (var arr = ["ambientMaterial", "emissiveMaterial", "diffuseMaterial", "specularColor"], i = 0; i < arr.length; i++) {
      if (this[arr[i]].length > 0)
        continue;
      if (options[arr[i] + "s"] === undefined) {
        this[arr[i]] = [0, 0, 0, 0];
      } else {
        this[arr[i]] = this[arr[i] + "s"].slice(0, 4);
        //this[arr[i]].push(1);
      }
    }
  }
}

function setNormals(geometry) {
  for (var i = 0; i < geometry.indices.length; i+=3) {
    var j = 3 * geometry.indices[i];
    var v0 = geometry.vertexPositions.slice(j, j + 3);
    var k = 3 * geometry.indices[i + 1];
    var v1 = geometry.vertexPositions.slice(k, k + 3);
    var l = 3 * geometry.indices[i + 2];
    var v2 = geometry.vertexPositions.slice(l, l + 3);
    var nx = (v1[1] - v0[1]) * (v2[2] - v0[2]) - (v2[1] - v0[1]) * (v1[2] - v0[2]);
    var ny = -(v1[0] - v0[0]) * (v2[2] - v0[2]) + (v2[0] - v0[0]) * (v1[2] - v0[2]);
    var nz = (v1[0] - v0[0]) * (v2[1] - v0[1]) - (v2[0] - v0[0]) * (v1[1] - v0[1]);
    var n = Math.sqrt(nx * nx + ny * ny + nz * nz);
    //j /= 3;
    //k /= 3;
    //l /= 3;
    geometry.vertexNormals[j] = nx / n;
    geometry.vertexNormals[j + 1] = ny / n;
    geometry.vertexNormals[j + 2] = nz / n;

    geometry.vertexNormals[k] = nx / n;
    geometry.vertexNormals[k + 1] = ny / n;
    geometry.vertexNormals[k + 2] = nz / n;

    geometry.vertexNormals[l] = nx / n;
    geometry.vertexNormals[l + 1] = ny / n;
    geometry.vertexNormals[l + 2] = nz / n;
  }
}

/* https://github.com/nickdesaulniers/prims/blob/master/icosahedron.js
function sub (a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; };
  function cross (a, b) {
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0]
    ];
  };
  function normalize (a) {
    var length = a[0] * a[0] + a[1] * a[1] + a[2] * a[2];
    return [a[0] / length, a[1] / length, a[2] / length];
  };

  var normals = [];
  for (var i = 0; i < vertices.length; i += 9) {
    var a = [vertices[i    ], vertices[i + 1], vertices[i + 2]];
    var b = [vertices[i + 3], vertices[i + 4], vertices[i + 5]];
    var c = [vertices[i + 6], vertices[i + 7], vertices[i + 8]];
    // Normalizing is probably not necessary.
    // It should also be seperated out.
    var normal = normalize(cross(sub(a, b), sub(a, c)));
    normals = normals.concat(normal, normal, normal);
  }
*/
