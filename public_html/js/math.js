/**
 * Math Library
 * @namespace math
 */
var math = (function() {
   var exports = {};

   /**
    * Create a Point
    * @class Point
    * @param {Number} x
    * @param {Number} y
    * @param {Number} z
    * @returns {Point}
    */
   exports.Point = function(x, y, z) {
      this.x = x | 0;
      this.y = y | 0;
      this.z = z | 0;
      return this;
   };
   /**
    * Create a Ray to cast
    * @class Ray
    * @returns {Ray}
    */
   exports.Ray = exports.Point;
   /**
    * Create a Triangle
    * @class Triangle
    * @param {Point} a
    * @param {Point} b
    * @param {Point} c
    * @returns {Triangle}
    */
   exports.Triangle = function(a, b, c) {
      this.a = a | new exports.Point();
      this.b = b | new exports.Point();
      this.c = c | new exports.Point();
      return this;
   };

   return exports;
}());