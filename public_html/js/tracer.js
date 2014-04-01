// Load our math library
importScripts("math.js");

/**
 * JavaScript Ray Tracer
 * @namespace tracer
 */
var tracer = (function() {
   var exports = {};

   var shapes = [];

   /**
    * Cast a Ray against triangles
    * @param {Ray} ray
    * @returns {Boolean} Whether there was a collision
    */
   exports.castRay = function(ray) {
      var nearest = Number.MAX_VALUE;
      for (var i = 0; i < shapes.length; i++) {
         var result = math.intersect(ray, shapes[i]);
         nearest = (result < nearest ? result : nearest);
      }
      return nearest;
   };

   /**
    * Add a Triangle to the list of tris to collide against
    * @param {Object} tri
    */
   exports.addShape = function(tri) {
      shapes.push(tri);
   };

   return exports;
}());

/**
 * Handle incoming messages
 * @param {type} e
 * @returns {undefined}
 */
self.onmessage = function(e) {
   if (e.data.type && e.data.data) {
      var data;
      switch (e.data.type) {
         // TODO: See if there is a better way to reinstanciate objects when sent to worker
         case "ray":
            // Get data
            data = JSON.parse(e.data.data);

            // Make a Ray
            var ray = new math.Ray(
                    new math.Vect(data.o.x, data.o.y, data.o.z),
                    new math.Vect(data.dir.x, data.dir.y, data.dir.z));

            // Cast the Ray
            var intersectionTest = tracer.castRay(ray);

            if (intersectionTest !== math.getNoIntersection()) {
               self.postMessage({
                  type: "Notification",
                  message: "There was a collision at: " + ray.getPoint(intersectionTest).toString()
               });
            }
            else {
               self.postMessage({
                  type: "Notification",
                  message: "There was NO collision"
               });
            }
            break;
         case "tri":
            // Get data
            data = JSON.parse(e.data.data);

            // Make a tri
            var tri = new math.Triangle(
                    new math.Vect(data.a.x, data.a.y, data.a.z),
                    new math.Vect(data.b.x, data.b.y, data.b.z),
                    new math.Vect(data.c.x, data.c.y, data.c.z));

            // Add the Triangle to collidable shapes
            tracer.addShape(tri);
            break;
         case "sphere":
            // Get data
            data = JSON.parse(e.data.data);

            // Make a Sphere
            var sphere = new math.Sphere(
                    new math.Vect(data.c.x, data.c.y, data.c.z),
                    data.r);

            // Add the Sphere to the collidable shapes
            tracer.addShape(sphere);
            break;
         default :
            self.postMessage({
               type: "Error",
               message: "Not sure what you want"
            });
      }
   }
   else {
      self.postMessage({
         type: "Error",
         message: "Must supply a type"
      });
   }
};