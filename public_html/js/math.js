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
    * Check that two Vect are equal within tolerance
    * @param {type} v0
    * @param {type} v1
    * @returns {Boolean}
    */
   exports.equality = function(v0, v1) {
      return ((Math.abs(v0.x - v1.x) < tolerance) &&
              (Math.abs(v0.y - v1.y) < tolerance) &&
              (Math.abs(v0.z - v1.z) < tolerance) &&
              (Math.abs(v0.w - v1.w) < tolerance));
   };

   /**
    * Collide a Ray with a Triangle
    * @param {Ray} ray
    * @param {Triangle} tri
    * @returns {Boolean} Whether there was an intersection
    */
   exports.intersectRayTri = function(ray, tri) {
      // TODO: Collision should return more data than a boolean
      var vecP2mP1 = math.subtract(tri.b, tri.a);
      var vecP3mP1 = math.subtract(tri.c, tri.a);

      var cross = math.normalize(math.cross(ray.dir, vecP3mP1));
      var crossDot = math.dot(vecP2mP1, cross);

      // Can't be parallel
      if ((crossDot > -tolerance) && (crossDot < tolerance)) {
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
   };

   /**
    * Collide a Ray with a Sphere
    * @param {Ray} ray
    * @param {Sphere} sphere
    * @returns {Boolean} Whether there was an intersection
    */
   exports.intersectRaySphere = function(ray, sphere) {
      // TODO: Impliment ray sphere should return more data than a boolean

      var raySphereDist, projSphereRay, distProjToSphereSqrt,
              distToCollisionPoint, distToCollisionPoint1;

      // Get distance from ray origin to center of sphere
      raySphereDist = math.subtract(sphere.c, ray.o);

      // See if sphere is behind the ray
      if (math.dot(raySphereDist, ray.dir) < 0) {
         // The ray can't intersect the sphere if the distance between the ray 
         // and the center of the sphere is greater than the radius
         if (math.magnitude(raySphereDist) > sphere.r) {
            return false;
         }
         // If the radius is the same as the distance, then there is one 
         // intersection and it is at the origin of the ray
         else if (math.magnitude(raySphereDist) === sphere.r) {
            return true;
            // Intersection = ray.o
         }
         // Otherwise the ray starts in the sphere
         else {
            projSphereRay = math.projection(sphere.c, ray.dir);
            distProjToSphereSqrt = math.magnitude(math.subtract(projSphereRay, sphere.c));
            distToCollisionPoint = Math.sqrt((sphere.r * sphere.r) - (distProjToSphereSqrt * distProjToSphereSqrt));
            distToCollisionPoint1 = math.magnitude(math.subtract(math.subtract(projSphereRay, ray.o), distToCollisionPoint));
            return true;
         }
      }
      // Otherwise the sphere is somewhere in front of the ray
      else {
         // Project center of sphere onto the ray
         projSphereRay = math.projection(sphere.c, ray.dir);

         // Make sure the distance from the projection to the center of the 
         // sphere is less than the radius of the sphere
         if (math.magnitude(math.subtract(sphere.c, projSphereRay)) > sphere.r) {
            return false;
         }
         else {
            distProjToSphereSqrt = math.magnitude(math.subtract(projSphereRay, sphere.c));
            distToCollisionPoint = Math.sqrt((sphere.r * sphere.r) - (distProjToSphereSqrt * distProjToSphereSqrt));
            if (math.magnitude(raySphereDist) > sphere.r) {
               distToCollisionPoint1 = math.magnitude(math.subtract(math.subtract(projSphereRay, ray.o), distToCollisionPoint));
            }
            else {
               distToCollisionPoint1 = math.magnitude(math.add(math.subtract(projSphereRay, ray.o), distToCollisionPoint));
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