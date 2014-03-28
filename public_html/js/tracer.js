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

      var vec01 = math.subtract(tri.a, tri.b);
      var vec12 = math.subtract(tri.b, tri.c);

      var cross = math.normalize(math.cross(ray.dir, vec12));
      var crossDot = math.dot(vec01, cross);

      // Can't be parallel
      if (crossDot > -0.0001 && crossDot < 0.00001) {
         return false;
      }

      var f = 1 / crossDot;
      var vecPosToPoint = math.subtract(ray.o, tri.a);
      var u = f * math.dot(vecPosToPoint, cross);

      if (u < 0.0 || u > 1.0) {
         return false;
      }

      var q = math.cross(vecPosToPoint, vec01);
      var v = f * math.dot(ray.dir, q);

      // TODO: Finish intersect function

      return false;
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
         // TODO: Reinstanciate objects with proper type when sent from parent to worker
         case "ray":
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