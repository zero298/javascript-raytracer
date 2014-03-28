// Load our math library
importScripts("math.js");

/**
 * JavaScript Ray Tracer
 * @namespace tracer
 */
var tracer = (function() {
   var exports = {};

   var tris = [];

   /**
    * Collide a Ray against a Triangle
    * @param {app.Ray} ray
    * @param {app.Triangle} tri
    * @returns {Boolean} Whether there was an intersection
    */
   function intersect(ray, tri) {

      /**
       * Get cross product of two vectors
       * @param {app.Point} v0
       * @param {app.Point} v1
       * @returns {app.Point}
       */
      function cross(v0, v1) {
         var v = new math.Point();
         v.x = (v0.y * v1.z) - (v0.z * v1.y);
         v.y = (v0.z * v1.x) - (v0.x * v1.z);
         v.z = (v0.x * v1.y) - (v0.y * v1.x);
         return v;
      }

      /**
       * Find dot product of two vectors
       * @param {app.Point} v0
       * @param {app.Point} v1
       * @returns {Number}
       */
      function dot(v0, v1) {
         return ((v0.x * v1.x) +
                 (v0.y * v1.y) +
                 (v0.z * v1.z));
      }

      var vec01 = new math.Point(
              tri.a.x - tri.b.x,
              tri.a.y - tri.b.y,
              tri.a.z - tri.b.z);

      var vec12 = new math.Point(
              tri.b.x - tri.c.x,
              tri.b.y - tri.c.y,
              tri.b.z - tri.c.z);

      var triNormal = cross(vec01, vec12);

      if (dot(ray, triNormal) > 0) {
         return true;
      }
      else {
         return false;
      }

      //return true;
   }

   /**
    * Cast a Ray against triangles
    * @param {Ray} ray
    * @returns {Boolean} Whether there was a collision
    */
   exports.castRay = function(ray) {
      for (var i = 0; i < tris.length; i++) {
         if (intersect(ray, tris[i])) {
            return true;
         }
      }
      return false;
   };

   /**
    * Add a Triangle to the list of tris to collide against
    * @param {Triangle} tri
    * @returns {undefined}
    */
   exports.addTri = function(tri) {
      tris.push(tri);
   };

   return exports;
}());

self.onmessage = function(e) {
   if (e.data.type) {
      switch (e.data.type) {
         case "ray":
//            self.postMessage({
//               type: "info",
//               message: "You want a ray cast"
//            });
            if (tracer.castRay(JSON.parse(e.data.data))) {
               self.postMessage({
                  type: "info",
                  message: "There was a collision"
               });
            }
            else {
               self.postMessage({
                  type: "info",
                  message: "There was NO collision"
               });
            }
            break;
         case "tri":
//            self.postMessage({
//               type: "info",
//               message: "You want to add a new tri"
//            });
            tracer.addTri(JSON.parse(e.data.data));
            break;
         default :
            self.postMessage({
               type: "info",
               message: "Not sure what you want"
            });
      }
   }
   else {
      self.postMessage({
         type: "info",
         message: "Must supply a type"
      });
   }
};