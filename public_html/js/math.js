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

   var nextShapeId = 0;

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
   exports.Vect = function Vect(x, y, z, w) {
      this.x = x || 0;
      this.y = y || 0;
      this.z = z || 0;
      this.w = w || 0;
   };

   /**
    * Converts this object to string format
    * @returns {String} The string representation of the Vect
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
   exports.Ray = function Ray(o, dir) {
      this.o = o || new math.Vect();
      this.dir = dir || new math.Vect();
   };

   /**
    * Convert Ray to string
    * @returns {String} The string representation of the Ray
    */
   exports.Ray.prototype.toString = function() {
      return "{Origin: " + this.o.toString() + ", Direction: " + this.dir.toString() + "}";
   };

   /**
    * Get a point along the ray
    * @param {Number} t The position along the line to retrieve
    * @returns {Vect} The point at position t
    */
   exports.Ray.prototype.getPoint = function(t) {
      return math.add(this.o, math.scale(this.dir, t));
   };

   exports.Shape = function Shape() {
      this.color = new exports.Vect(
              Math.floor((Math.random() * 255) + 1),
              Math.floor((Math.random() * 255) + 1),
              Math.floor((Math.random() * 255) + 1));
   };

   /**
    * Create a Triangle
    * @constructor
    * @classdesc A triangle that is composed of three points in space
    * @param {Vect} a The first point in the triangle
    * @param {Vect} b The second point in the triangle
    * @param {Vect} c The third point in the triangle
    */
   exports.Triangle = function Triangle(a, b, c) {
      exports.Shape.call();
      /**
       * The unique id of the Shape
       * @type {Number}
       */
      this.shapeId = nextShapeId++;
      /**
       * The first point in the Triangle
       * @type {Vect}
       */
      this.a = a || new math.Vect();
      /**
       * The second point in the Triangle
       * @type {Vect}
       */
      this.b = b || new math.Vect();
      /**
       * The third point in the Triangle
       * @type {Vect}
       */
      this.c = c || new math.Vect();
      /**
       * The current normal of the Triangle
       * @type {Vect}
       */
      this.normal = math.normalize(math.cross(
              math.subtract(this.a, this.b),
              math.subtract(this.a, this.c)));
   };
   exports.Triangle.prototype = new exports.Shape;
   exports.Triangle.prototype.constructor = exports.Triangle;

   /**
    * Get the normal of the Triangle
    * @returns {Vect}
    */
   exports.Triangle.prototype.getNormal = function() {
      return this.normal;
   };

   /**
    * Get the string representation of this Triangle
    * @returns {String} The string representation of this Triangle
    */
   exports.Triangle.prototype.toString = function() {
      return "{A: " + this.a + ", B: " + this.b + ", C: " + this.c + "}";
   };

   /**
    * Creates a Sphere
    * @constructor
    * @classdesc A three dimensional sphere in space represented by a point and a radius
    * @param {Vect} c The center of the Sphere
    * @param {Number} r The radius of the Sphere
    */
   exports.Sphere = function Sphere(c, r) {
      exports.Shape.call();
      /**
       * The unique id of the Shape
       * @type {Number}
       */
      this.shapeId = nextShapeId++;
      /**
       * The center of the Sphere
       * @type {Vect}
       */
      this.c = c || new exports.Vect();
      /**
       * The radius of the Sphere
       * @type {Number}
       */
      this.r = r || 0;
   };
   exports.Sphere.prototype = new exports.Shape();
   exports.Sphere.prototype.constructor = exports.Sphere;

   /**
    * Returns the Normal of this sphere at a given point
    * @param {type} point Point on the sphere to get the normal of
    * @returns {Vect}
    */
   exports.Sphere.prototype.getNormal = function(point) {
      return math.normalize(math.subtract(point, this.c));
   };

   /**
    * Get the string representation of this sphere
    * @returns {String} String representation of the Sphere
    */
   exports.Sphere.prototype.toString = function() {
      return "{Origin: " + this.c + ", Radius: " + this.r + "}";
   };

   /**
    * A record of a collision between objects
    * @constructor
    * @classdesc A record of a collision between two objects
    * @param {Number} t The time at which the collision occured
    * @param {Vect} point The position at which the collision occured
    * @param {Vect} normal The collision normal
    */
   exports.CollisionRecord = function CollisionRecord(t, point, normal) {
      this.t = t || 0;
      this.point = point || new math.Vect();
      this.normal = normal || new math.Vect();
   };

   /**
    * Viewport constructor
    * @constructor
    * @classdesc A viewport to cast rays through
    * @param {type} width
    * @param {type} height
    * @param {type} top
    * @param {type} bottom
    * @param {type} left
    * @param {type} right
    * @param {type} near
    * @param {type} far
    * @param {type} fov
    * @returns {undefined}
    */
   exports.Viewport = function Viewport(width, height, top, bottom, left, right, near, far, fov) {
      this.width = width || 128;
      this.height = height || 128;
      this.top = top || 1;
      this.bottom = bottom || -1;
      this.left = left || -1;
      this.right = right || 1;
      this.near = near || 0.1;
      this.far = far || 100;
      this.fov = fov || 45;
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
    * Return a negated vector
    * @param {type} v The vector to negate
    * @returns {Vect} The negated vector
    */
   exports.negate = function(v) {
      return new math.Vect(-v.x, -v.y, -v.z);
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
    * Convert degrees to radians
    * @param {Number} degrees Degrees to convert
    * @returns {Number} Radians conversion
    */
   exports.degToRad = function(degrees) {
      return ((degrees * Math.PI) / 180.0);
   };

   /**
    * Convert radians to degress
    * @param {Number} radians Radians to convert
    * @returns {Number} Degrees conversion
    */
   exports.radToDeg = function(radians) {
      return ((radians * 180.0) / Math.PI);
   };

   /**
    * Collide a Ray with a Triangle
    * @param {Ray} ray The ray to cast for collision
    * @param {Triangle} tri The triangle to check for collision
    * @returns {CollisionRecord} The collision record of the intersection
    */
   exports.intersectRayTri = function(ray, tri) {
      var vecP2mP1 = math.subtract(tri.b, tri.a);
      var vecP3mP1 = math.subtract(tri.c, tri.a);

      var cross = math.cross(ray.dir, vecP3mP1);
      var crossDot = math.dot(vecP2mP1, cross);

      // Can't be parallel
      if ((crossDot > -math.tolerance) && (crossDot < math.tolerance)) {
         //return false;
         //return math.NO_INTERSECTION;
         return new math.CollisionRecord(math.NO_INTERSECTION);
      }

      var f = 1 / crossDot;
      var vecPosToPoint = math.subtract(ray.o, tri.a);
      var u = f * math.dot(vecPosToPoint, cross);

      if (u < 0.0 || u > 1.0) {
         //return false;
         //return math.NO_INTERSECTION;
         return new math.CollisionRecord(math.NO_INTERSECTION);
      }

      var q = math.cross(vecPosToPoint, vecP2mP1);
      var v = f * math.dot(ray.dir, q);

      if (v < 0.0 || u + v > 1.0) {
         //return false;
         //return math.NO_INTERSECTION;
         return new math.CollisionRecord(math.NO_INTERSECTION);
      }

      var t = f * math.dot(vecP3mP1, q);

      if (t <= 0) {
         //return false;
         //return math.NO_INTERSECTION;
         return new math.CollisionRecord(math.NO_INTERSECTION);
      }

      //return math.add(ray.o, math.scale(ray.dir, t));
      //return t;
      tri.normal = (math.dot(ray.dir, tri.normal) > 0 ? math.negate(tri.normal) : tri.normal);
      return new math.CollisionRecord(t, ray.getPoint(t), tri.normal);

   };

   /**
    * Collide a Ray with a Sphere
    * @param {Ray} ray The ray to cast for collision
    * @param {Sphere} sphere the Sphere to check for collision
    * @returns {CollisionRecord} The collision of the ray and sphere
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
            //return math.NO_INTERSECTION;
            return new math.CollisionRecord(math.NO_INTERSECTION);
         }
         // If the radius is the same as the distance, then there is one 
         // intersection and it is at the origin of the ray
         else if (math.equalityNumber(math.magnitude(raySphereDist), sphere.r)) {
            //return new math.Vect(ray.o.x, ray.o.y, ray.o.z);
            //return 0;
            return new math.CollisionRecord(0, ray.o);
         }
         // Otherwise the ray starts in the sphere
         else {
            projSphereRay = math.projection(sphere.c, ray.dir);
            distProjToSphereSqrt = math.magnitude(math.subtract(projSphereRay, sphere.c));
            distToCollisionPoint = Math.sqrt((sphere.r * sphere.r) - (distProjToSphereSqrt * distProjToSphereSqrt));
            t = math.magnitude(math.subtract(math.subtract(projSphereRay, ray.o), distToCollisionPoint));
            //return math.add(ray.o, math.scale(ray.dir, t));
            //return t;
            var point = ray.getPoint(t);
            return new math.CollisionRecord(t, point, math.normalize(math.subtract(point, sphere.c)));

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
            //return math.NO_INTERSECTION;
            return new math.CollisionRecord(math.NO_INTERSECTION);
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
            //return t;
            var point = ray.getPoint(t);
            return new math.CollisionRecord(t, point, math.normalize(math.subtract(point, sphere.c)));
         }
      }

      //return math.NO_INTERSECTION;
      return new math.CollisionRecord(math.NO_INTERSECTION);
   };

   /**
    * Try and intersect two objects
    * @param {Object} a The collider object of the collision check
    * @param {Object} b The collidee object of the collision check
    * @returns {CollisionRecord} The record of collision
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

   /**
    * Namespace to hold random generation function
    * @namespace randomizer
    */
   exports.randomizer = {
      /**
       * Create a random floating point Vect between a minimum and a maximum
       * @param {type} minX
       * @param {type} maxX
       * @param {type} minY
       * @param {type} maxY
       * @param {type} minZ
       * @param {type} maxZ
       * @returns {Vect}
       */
      randomVectFloat: function(minX, maxX, minY, maxY, minZ, maxZ) {
         return new math.Vect(
                 ((Math.random() * (maxX - minX)) + minX),
                 ((Math.random() * (maxY - minY)) + minY),
                 ((Math.random() * (maxZ - minZ)) + minZ));
      },
      /**
       * Create a random integer Vect between a minimum and a maximum
       * @param {type} minX
       * @param {type} maxX
       * @param {type} minY
       * @param {type} maxY
       * @param {type} minZ
       * @param {type} maxZ
       * @returns {Vect}
       */
      randomVectInt: function(minX, maxX, minY, maxY, minZ, maxZ) {
         return new math.Vect(
                 Math.round((Math.random() * (maxX - minX)) + minX),
                 Math.round((Math.random() * (maxY - minY)) + minY),
                 Math.round((Math.random() * (maxZ - minZ)) + minZ));
      },
      /**
       * Create a random triangle
       * @returns {Triangle} A randomly generated Triangle
       */
      randomTri: function() {
         var tri =
                 new math.Triangle(
                         math.randomizer.randomVectFloat(-5, 5, -5, 5, -20, -10),
                         math.randomizer.randomVectFloat(-5, 5, -5, 5, -20, -10),
                         math.randomizer.randomVectFloat(-5, 5, -5, 5, -20, -10));
         tri.color = math.randomizer.randomVectInt(0, 255, 0, 255, 0, 255);
         return tri;
      },
      /**
       * Create a random Sphere
       * @returns {Sphere} A randomly generated Sphere
       */
      randomSphere: function() {
         var sphere =
                 new math.Sphere(
                         math.randomizer.randomVectFloat(-5, 5, -5, 5, -20, -10),
                         (Math.random() * 0.5) + 0.5);
         sphere.color = math.randomizer.randomVectInt(0, 255, 0, 255, 0, 255);
         return sphere;
      }
   };

   return exports;
}());