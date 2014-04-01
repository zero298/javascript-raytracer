/**
 * Math Library
 * @namespace math
 */
var math = (function() {
   var exports = {};

   /**
    * Floating point error allowed
    * @type Number
    */
   var tolerance = 0.0001;

   /**
    * Set the tolerance of the math library
    * @param {Number} t The new tolerance
    */
   exports.setTolerance = function(t) {
      tolerance = t;
   };

   /**
    * Static to represent no intersection
    * @type Number
    */
   var NO_INTERSECTION = Number.MAX_VALUE;

   /**
    * Find out what the no intersection constant is
    * @returns {Number}
    */
   exports.getNoIntersection = function() {
      return NO_INTERSECTION;
   };

   /**
    * Get the tolerance of the math library
    * @returns {Number} The current tolerance
    */
   exports.getTolerance = function() {
      return tolerance;
   };

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
    * Converts this object to string format
    * @returns {String}
    */
   exports.Vect.prototype.toString = function() {
      return "{x: " + this.x + " y: " + this.y + " z: " + this.z + " w: " + this.w + "}";
   };

   /**
    * Create a Ray to cast
    * @class Ray
    * @param {Vect} o Origin of Ray
    * @param {Vect} dir Direction of Ray
    * @returns {Ray}
    */
   exports.Ray = function(o, dir) {
      this.o = o || new math.Vect();
      this.dir = dir || new math.Vect();
   };

   /**
    * Get a point along the ray
    * @param {Number} t
    * @returns {Vect}
    */
   exports.Ray.prototype.getPoint = function(t) {
      return math.add(this.o, math.scale(this.dir, t));
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
      this.a = a || new math.Vect();
      this.b = b || new math.Vect();
      this.c = c || new math.Vect();
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
      this.c = c || new math.Vect();
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
      var mag = math.magnitude(v);
      // Don't let us divide by zero
      mag = mag || 1;
      return new math.Vect(
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
      var v2Mag = math.magnitude(v2);
      return math.scale(v2, (math.dot(v1, v2) / (v2Mag * v2Mag)));
   };

   /**
    * Scale a Vect by a scalar
    * @param {Vect} v0
    * @param {Number} s
    * @returns {Vect}
    */
   exports.scale = function(v0, s) {
      return new math.Vect(
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
      return new math.Vect(
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
      return new math.Vect(
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
      return new math.Vect(
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
      return new math.Vect(
              v0.x / v1.x,
              v0.y / v1.y,
              v0.z / v1.z);
   };

   /**
    * Check that two Vect are equal within tolerance
    * @param {type} v0
    * @param {type} v1
    * @returns {Boolean}
    */
   exports.equalityVect = function(v0, v1) {
      return ((Math.abs(v0.x - v1.x) < tolerance) &&
              (Math.abs(v0.y - v1.y) < tolerance) &&
              (Math.abs(v0.z - v1.z) < tolerance) &&
              (Math.abs(v0.w - v1.w) < tolerance));
   };

   /**
    * See if two Numbers are equal within tolerance
    * @param {Number} n0
    * @param {Number} n1
    * @returns {Boolean}
    */
   exports.equalityNumber = function(n0, n1) {
      return (Math.abs(n0 - n1) < tolerance);
   };

   /**
    * Collide a Ray with a Triangle
    * @param {Ray} ray
    * @param {Triangle} tri
    * @returns {Number} Where along the ray the intersection occured
    */
   exports.intersectRayTri = function(ray, tri) {
      var vecP2mP1 = math.subtract(tri.b, tri.a);
      var vecP3mP1 = math.subtract(tri.c, tri.a);

      var cross = math.cross(ray.dir, vecP3mP1);
      var crossDot = math.dot(vecP2mP1, cross);

      // Can't be parallel
      if ((crossDot > -tolerance) && (crossDot < tolerance)) {
         //return false;
         return NO_INTERSECTION;
      }

      var f = 1 / crossDot;
      var vecPosToPoint = math.subtract(ray.o, tri.a);
      var u = f * math.dot(vecPosToPoint, cross);

      if (u < 0.0 || u > 1.0) {
         //return false;
         return NO_INTERSECTION;
      }

      var q = math.cross(vecPosToPoint, vecP2mP1);
      var v = f * math.dot(ray.dir, q);

      if (v < 0.0 || u + v > 1.0) {
         //return false;
         return NO_INTERSECTION;
      }

      var t = f * math.dot(vecP3mP1, q);

      if (t <= 0) {
         //return false;
         return NO_INTERSECTION;
      }

      //return math.add(ray.o, math.scale(ray.dir, t));
      return t;
   };

   /**
    * Collide a Ray with a Sphere
    * @param {Ray} ray
    * @param {Sphere} sphere
    * @returns {Number} Where along the ray the intersection occured
    */
   exports.intersectRaySphere = function(ray, sphere) {

      var raySphereDist, projSphereRay, distProjToSphereSqrt,
              distToCollisionPoint, t;

      // Get distance from ray origin to center of sphere
      raySphereDist = math.subtract(sphere.c, ray.o);

      // See if sphere is behind the ray
      if (math.dot(raySphereDist, ray.dir) < 0) {
         // The ray can't intersect the sphere if the distance between the ray 
         // and the center of the sphere is greater than the radius
         if (math.magnitude(raySphereDist) > sphere.r) {
            //return false;
            return NO_INTERSECTION;
         }
         // If the radius is the same as the distance, then there is one 
         // intersection and it is at the origin of the ray
         else if (math.equalityNumber(math.magnitude(raySphereDist), sphere.r)) {
            //return new math.Vect(ray.o.x, ray.o.y, ray.o.z);
            return 0;
         }
         // Otherwise the ray starts in the sphere
         else {
            projSphereRay = math.projection(sphere.c, ray.dir);
            distProjToSphereSqrt = math.magnitude(math.subtract(projSphereRay, sphere.c));
            distToCollisionPoint = Math.sqrt((sphere.r * sphere.r) - (distProjToSphereSqrt * distProjToSphereSqrt));
            t = math.magnitude(math.subtract(math.subtract(projSphereRay, ray.o), distToCollisionPoint));
            //return math.add(ray.o, math.scale(ray.dir, t));
            return t;
         }
      }
      // Otherwise the sphere is somewhere in front of the ray
      else {
         // Project center of sphere onto the ray
         projSphereRay = math.projection(sphere.c, ray.dir);

         // Make sure the distance from the projection to the center of the 
         // sphere is less than the radius of the sphere
         if (math.magnitude(math.subtract(sphere.c, projSphereRay)) > sphere.r) {
            //return false;
            return NO_INTERSECTION;
         }
         else {
            distProjToSphereSqrt = math.magnitude(math.subtract(projSphereRay, sphere.c));
            distToCollisionPoint = Math.sqrt((sphere.r * sphere.r) - (distProjToSphereSqrt * distProjToSphereSqrt));
            if (math.magnitude(raySphereDist) > sphere.r) {
               t = (math.magnitude(math.subtract(projSphereRay, ray.o)) - distToCollisionPoint);
            }
            else {
               t = (math.magnitude(math.subtract(projSphereRay, ray.o)) + distToCollisionPoint);
            }
            //return math.add(ray.o, math.scale(ray.dir, t));
            return t;
         }
      }

      return NO_INTERSECTION;
   };

   /**
    * Try and intersect two objects
    * @param {Object} a
    * @param {Object} b
    * @returns {Number}
    */
   exports.intersect = function(a, b) {
      // Intersect Ray and Triangle
      if (a instanceof math.Ray && b instanceof math.Triangle) {
         return math.intersectRayTri(a, b);
      }

      // Intersect Ray and Sphere
      if (a instanceof math.Ray && b instanceof math.Sphere) {
         return math.intersectRaySphere(a, b);
      }
   };

   return exports;
}());