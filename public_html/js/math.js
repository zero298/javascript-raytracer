/**
 * Math Library
 * @namespace math
 */
var math = (function() {
   var exports = {};

   /**
    * Create a Point
    * @class Vect
    * @param {Number} x
    * @param {Number} y
    * @param {Number} z
    * @param {Number} w
    * @returns {Point}
    */
   exports.Vect = function(x, y, z, w) {
      this.x = x || 0;
      this.y = y || 0;
      this.z = z || 0;
      this.w = w || 0;
   };

   /**
    * Create a Point
    * @extends Vect
    */
   exports.Point = function() {
   };
   exports.Point.prototype = new exports.Vect();
   exports.Point.prototype.constructor = exports.Vect;

   /**
    * Create a Ray to cast
    * @class Ray
    * @param {Point} o Origin of Ray
    * @param {Vect} dir Direction of Ray
    * @returns {Ray}
    */
   exports.Ray = function(o, dir) {
      this.o = o || new exports.Point();
      this.dir = dir || new exports.Vect();
   };

   /**
    * Create a Triangle
    * @class Triangle
    * @param {Point} a
    * @param {Point} b
    * @param {Point} c
    * @returns {Triangle}
    */
   exports.Triangle = function(a, b, c) {
      this.a = a || new exports.Point();
      this.b = b || new exports.Point();
      this.c = c || new exports.Point();
   };

   /**
    * Get cross product of two vectors
    * @param {Vect} v0
    * @param {Vect} v1
    * @returns {Vect}
    */
   exports.cross = function(v0, v1) {
      var v = new math.Point();
      v.x = (v0.y * v1.z) - (v0.z * v1.y);
      v.y = (v0.z * v1.x) - (v0.x * v1.z);
      v.z = (v0.x * v1.y) - (v0.y * v1.x);
      return v;
   };

   /**
    * Find dot product of two vectors
    * @param {Vect} v0
    * @param {Vect} v1
    * @returns {Number}
    */
   exports.dot = function(v0, v1) {
      return ((v0.x * v1.x) +
              (v0.y * v1.y) +
              (v0.z * v1.z));
   };

   /**
    * Normalize a vector
    * @param {Vect} v
    * @returns {Vect}
    */
   exports.normalize = function(v) {
      var mag = exports.magnitude(v);
      // Don't let us divide by zero
      mag = mag || 1;
      return new exports.Vect(
              v.x / mag,
              v.y / mag,
              v.z / mag,
              v.w / mag);
   };

   /**
    * Get the magnitude of a vector
    * @param {Vect} v
    * @returns {Number}
    */
   exports.magnitude = function(v) {
      return Math.sqrt(
              (v.x * v.x) +
              (v.y * v.y) +
              (v.z * v.z) +
              (v.w * v.w));
   };

   /**
    * Return the difference between two vects
    * @param {Vect} v0
    * @param {Vect} v1
    * @returns {Vect}
    */
   exports.subtract = function(v0, v1) {
      return new exports.Vect(
              v0.x - v1.x,
              v0.y - v1.y,
              v0.z - v1.z);
   };

   return exports;
}());