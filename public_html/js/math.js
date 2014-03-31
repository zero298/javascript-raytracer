/**
 * Math Library
 * @namespace math
 */
var math = (function() {
   var exports = {};

   /**
    * Create a Vect
    * @class Vect
    * @param {Number} x
    * @param {Number} y
    * @param {Number} z
    * @param {Number} w
    * @returns {Vect}
    */
   exports.Vect = function(x, y, z, w) {
      this.x = x || 0;
      this.y = y || 0;
      this.z = z || 0;
      this.w = w || 0;
   };

   /**
    * Create a Ray to cast
    * @class Ray
    * @param {Vect} o Origin of Ray
    * @param {Vect} dir Direction of Ray
    * @returns {Ray}
    */
   exports.Ray = function(o, dir) {
      this.o = o || new exports.Vect();
      this.dir = dir || new exports.Vect();
   };

   /**
    * Create a Triangle
    * @class Triangle
    * @param {Vect} a
    * @param {Vect} b
    * @param {Vect} c
    * @returns {Triangle}
    */
   exports.Triangle = function(a, b, c) {
      this.a = a || new exports.Vect();
      this.b = b || new exports.Vect();
      this.c = c || new exports.Vect();
   };

   /**
    * Creates a Sphere
    * @class Sphere
    * @constructor
    * @property {Vect} c The center of the circle
    * @property {Number} r The radius of the circle
    * @param {Vect} c
    * @param {Number} r
    * @returns {Sphere}
    */
   exports.Sphere = function(c, r) {
      /**
       * @type {Vect} The center of the circle
       */
      this.c = c || new exports.Vect();
      /**
       * @type {Number} The radius of the circle
       */
      this.r = r || 0;
   };

   /**
    * Get cross product of two vectors
    * @param {Vect} v0
    * @param {Vect} v1
    * @returns {Vect}
    */
   exports.cross = function(v0, v1) {
      var v = new math.Vect();
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
    * Find the projection of one vector onto another
    * @param {Vect} v1
    * @param {Vect} v2
    * @returns {Vect}
    */
   exports.projection = function(v1, v2) {
      var v2Mag = exports.magnitude(v2);
      return exports.scale(v2, (exports.dot(v1, v2) / (v2Mag * v2Mag)));
   };

   /**
    * Scale a Vect by a scalar
    * @param {Vect} v0
    * @param {Number} s
    * @returns {Vect}
    */
   exports.scale = function(v0, s) {
      return new exports.Vect(
              v0.x * s,
              v0.y * s,
              v0.z * s);
   };

   /**
    * Add one Vect to another
    * @param {Vect} v0
    * @param {Vect} v1
    * @returns {Vect}
    */
   exports.add = function(v0, v1) {
      return new exports.Vect(
              v0.x + v1.x,
              v0.y + v1.y,
              v0.z + v1.z);
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

   /**
    * Multiply one vect by another
    * @param {Vect} v0
    * @param {Vect} v1
    * @returns {Vect}
    */
   exports.multiply = function(v0, v1) {
      return new exports.Vect(
              v0.x * v1.x,
              v0.y * v1.y,
              v0.z * v1.z);
   };

   /**
    * Divide a Vect by another
    * @param {Vect} v0
    * @param {Vect} v1
    * @returns {Vect}
    */
   exports.divide = function(v0, v1) {
      return new exports.Vect(
              v0.x / v1.x,
              v0.y / v1.y,
              v0.z / v1.z);
   };

   /**
    * Collide a Ray with a Triangle
    * @param {Ray} ray
    * @param {Triangle} tri
    * @returns {Boolean} Whether there was an intersection
    */
   exports.intersectRayTri = function(ray, tri) {
      var vecP2mP1 = math.subtract(tri.b, tri.a);
      var vecP3mP1 = math.subtract(tri.c, tri.a);

      var cross = math.normalize(math.cross(ray.dir, vecP3mP1));
      var crossDot = math.dot(vecP2mP1, cross);

      // Can't be parallel
      if ((crossDot > -0.0001) && (crossDot < 0.00001)) {
         return false;
      }

      var f = 1 / crossDot;
      var vecPosToPoint = math.subtract(ray.o, tri.a);
      var u = f * math.dot(vecPosToPoint, cross);

      if (u < 0.0 || u > 1.0) {
         return false;
      }

      var q = math.normalize(math.cross(vecPosToPoint, vecP2mP1));
      var v = f * math.dot(ray.dir, q);

      if (v < 0.0 || u + v > 1.0) {
         return false;
      }

      var t = f * math.dot(vecP3mP1, q);

      if (t <= 0) {
         return false;
      }

      return true;
      // TODO: Collision should return more data than a boolean
   };

   /**
    * Collide a Ray with a Sphere
    * @param {Ray} ray
    * @param {Sphere} sphere
    * @returns {Boolean} Whether there was an intersection
    */
   exports.intersectRaySphere = function(ray, sphere) {
      // TODO: Impliment ray sphere collision

      var vpc = math.subtract(sphere.c, ray.o);

      if (math.dot(vpc, ray.dir) < 0) {
         if (math.magnitude(vpc) > sphere.r) {
            return false;
         }
         else if (math.magnitude(vpc) === sphere.r) {
            return true;
            // Intersection = p
         }
         else {
            // Ray starts inside the sphere
         }
      }
      else {
         // Project center of sphere onto the ray
         var pc = math.projection(sphere.c, ray.dir);

         if (math.magnitude(math.subtract(sphere.c, pc) > sphere.r)) {
            return false;
         }
         else {
            var tmp = math.magnitude(math.subtract(pc, sphere.c));
            var dist = Math.sqrt((sphere.r * sphere.r) - (tmp * tmp));
            var di1;
            if (math.magnitude(vpc) > sphere.r) {
               di1 = math.magnitude(math.subtract(math.subtract(pc, ray.o), dist));
            }
            else {
               di1 = math.magnitude(math.add(math.subtract(pc, ray.o), dist));
            }
            return true;
         }
      }

      return false;
   };

   exports.intersect = function(a, b) {
      // Intersect Ray and Triangle
      if (a instanceof math.Ray && b instanceof math.Triangle) {
         return exports.intersectRayTri(a, b);
      }

      // Intersect Ray and Sphere
      if (a instanceof math.Ray && b instanceof math.Sphere) {
         return exports.intersectRaySphere(a, b);
      }
   };

   return exports;
}());