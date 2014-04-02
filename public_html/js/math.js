/**
 * @fileOverview This file holds the {@link math} namespace which serves as the 
 * mathematical library of functions to allow for three dimensional operations 
 * and intersections
 * @name Math Library
 */

/**
 * Math Library
 * @namespace math
 */
var math = (function() {
   var exports = {};

   /**
    * Floating point error allowed
    * @readonly
    * @constant {Number}
    */
   exports.tolerance = 0.0001;

   /**
    * Set the tolerance of the math library
    * @param {Number} t The new tolerance
    */
   exports.setTolerance = function(t) {
      math.tolerance = t;
   };

   /**
    * Static to represent no intersection
    * @readonly
    * @constant {Number}
    */
   exports.NO_INTERSECTION = Number.MAX_VALUE;

   /**
    * Find out what the no intersection constant is
    * @returns {Number} The constant representing that there was no intersection
    */
   exports.getNoIntersection = function() {
      return math.NO_INTERSECTION;
   };

   /**
    * Get the tolerance of the math library
    * @returns {Number} The current tolerance
    */
   exports.getTolerance = function() {
      return math.tolerance;
   };

   /**
    * Create a Vect
    * @constructor
    * @classdesc A three dimensional vector class with x, y, z, w coordinates
    * @param {Number} x The x coordinate
    * @param {Number} y The y coordinate
    * @param {Number} z The z coordinate
    * @param {Number} w The homogeneous component
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
    * @constructor
    * @classdesc A line that originates at a point in space and is pointed in a direction
    * @param {Vect} o Origin of Ray
    * @param {Vect} dir Direction of Ray
    */
   exports.Ray = function(o, dir) {
      this.o = o || new math.Vect();
      this.dir = dir || new math.Vect();
   };

   /**
    * Get a point along the ray
    * @param {Number} t The position along the line to retrieve
    * @returns {Vect} The point at position t
    */
   exports.Ray.prototype.getPoint = function(t) {
      return math.add(this.o, math.scale(this.dir, t));
   };

   /**
    * Create a Triangle
    * @constructor
    * @classdesc A triangle that is composed of three points in space
    * @param {Vect} a The first point in the triangle
    * @param {Vect} b The second point in the triangle
    * @param {Vect} c The third point in the triangle
    */
   exports.Triangle = function(a, b, c) {
      this.a = a || new math.Vect();
      this.b = b || new math.Vect();
      this.c = c || new math.Vect();
   };

   /**
    * Creates a Sphere
    * @constructor
    * @classdesc A three dimensional sphere in space represented by a point and a radius
    * @param {Vect} c The center of the Sphere
    * @param {Number} r The radius of the Sphere
    */
   exports.Sphere = function(c, r) {
      /**
       * The center of the Sphere
       * @type {Vect}
       */
      this.c = c || new math.Vect();
      /**
       * The radius of the Sphere
       * @type {Number}
       */
      this.r = r || 0;
   };

   /**
    * Get cross product of two vectors
    * @param {Vect} v0 The first vector of the cross operation
    * @param {Vect} v1 the second vector of the cross operation
    * @returns {Vect} The result of the cross operation
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
    * @param {Vect} v0 The first vector of the dot product operation
    * @param {Vect} v1 The second vector of the dot product operation
    * @returns {Number} The result of the dot product operation
    */
   exports.dot = function(v0, v1) {
      return ((v0.x * v1.x) +
              (v0.y * v1.y) +
              (v0.z * v1.z));
   };

   /**
    * Normalize a vector
    * @param {Vect} v The vector to normalize
    * @returns {Vect} The normalized vector
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
    * @param {Vect} v The vector to get the magnitude of
    * @returns {Number} The magnitude of the vector
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
    * @param {Vect} v1 The first vector of the projection operation
    * @param {Vect} v2 The second vector of the projection operation
    * @returns {Vect} The result of the projection operation
    */
   exports.projection = function(v1, v2) {
      var v2Mag = math.magnitude(v2);
      return math.scale(v2, (math.dot(v1, v2) / (v2Mag * v2Mag)));
   };

   /**
    * Scale a Vect by a scalar
    * @param {Vect} v0 The vector to scale
    * @param {Number} s The scalar to scale the vector by
    * @returns {Vect} The scaled vector
    */
   exports.scale = function(v0, s) {
      return new math.Vect(
              v0.x * s,
              v0.y * s,
              v0.z * s);
   };

   /**
    * Add one Vect to another
    * @param {Vect} v0 The first addend vector
    * @param {Vect} v1 The second addend vector
    * @returns {Vect} The sum of the vectors
    */
   exports.add = function(v0, v1) {
      return new math.Vect(
              v0.x + v1.x,
              v0.y + v1.y,
              v0.z + v1.z);
   };

   /**
    * Return the difference between two vects
    * @param {Vect} v0 The minuend vector
    * @param {Vect} v1 The subtrahend vector
    * @returns {Vect} The difference vector
    */
   exports.subtract = function(v0, v1) {
      return new math.Vect(
              v0.x - v1.x,
              v0.y - v1.y,
              v0.z - v1.z);
   };

   /**
    * Multiply one vect by another
    * @param {Vect} v0 The multiplicand vector
    * @param {Vect} v1 The multiplier vector
    * @returns {Vect} The product vector
    */
   exports.multiply = function(v0, v1) {
      return new math.Vect(
              v0.x * v1.x,
              v0.y * v1.y,
              v0.z * v1.z);
   };

   /**
    * Divide a Vect by another
    * @param {Vect} v0 The dividend vector
    * @param {Vect} v1 The divisor vector
    * @returns {Vect} The quotient vector
    */
   exports.divide = function(v0, v1) {
      return new math.Vect(
              v0.x / v1.x,
              v0.y / v1.y,
              v0.z / v1.z);
   };

   /**
    * Check that two Vect are equal within tolerance
    * @param {type} v0 The first vector to be compared for equality
    * @param {type} v1 The second vector to be compared for equality
    * @returns {Boolean} Whether the vectors are equal within tolerance
    */
   exports.equalityVect = function(v0, v1) {
      return ((Math.abs(v0.x - v1.x) < math.tolerance) &&
              (Math.abs(v0.y - v1.y) < math.tolerance) &&
              (Math.abs(v0.z - v1.z) < math.tolerance) &&
              (Math.abs(v0.w - v1.w) < math.tolerance));
   };

   /**
    * See if two Numbers are equal within tolerance
    * @param {Number} n0 The first number to be compared for equality
    * @param {Number} n1 The second number to be compared for equality
    * @returns {Boolean} Whether the numbers are equal within tolerance
    */
   exports.equalityNumber = function(n0, n1) {
      return (Math.abs(n0 - n1) < math.tolerance);
   };

   /**
    * Collide a Ray with a Triangle
    * @param {Ray} ray The ray to cast for collision
    * @param {Triangle} tri The triangle to check for collision
    * @returns {Number} Where along the ray the intersection occured
    */
   exports.intersectRayTri = function(ray, tri) {
      var vecP2mP1 = math.subtract(tri.b, tri.a);
      var vecP3mP1 = math.subtract(tri.c, tri.a);

      var cross = math.cross(ray.dir, vecP3mP1);
      var crossDot = math.dot(vecP2mP1, cross);

      // Can't be parallel
      if ((crossDot > -math.tolerance) && (crossDot < math.tolerance)) {
         //return false;
         return math.NO_INTERSECTION;
      }

      var f = 1 / crossDot;
      var vecPosToPoint = math.subtract(ray.o, tri.a);
      var u = f * math.dot(vecPosToPoint, cross);

      if (u < 0.0 || u > 1.0) {
         //return false;
         return math.NO_INTERSECTION;
      }

      var q = math.cross(vecPosToPoint, vecP2mP1);
      var v = f * math.dot(ray.dir, q);

      if (v < 0.0 || u + v > 1.0) {
         //return false;
         return math.NO_INTERSECTION;
      }

      var t = f * math.dot(vecP3mP1, q);

      if (t <= 0) {
         //return false;
         return math.NO_INTERSECTION;
      }

      //return math.add(ray.o, math.scale(ray.dir, t));
      return t;
   };

   /**
    * Collide a Ray with a Sphere
    * @param {Ray} ray The ray to cast for collision
    * @param {Sphere} sphere the Sphere to check for collision
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
            return math.NO_INTERSECTION;
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
            return math.NO_INTERSECTION;
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

      return math.NO_INTERSECTION;
   };

   /**
    * Try and intersect two objects
    * @param {Object} a The collider object of the collision check
    * @param {Object} b The collidee object of the collision check
    * @returns {Number} The penetration depth of the collision if there was one
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