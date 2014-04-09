/**
 * @fileOverview This file holds the {@link tracer} namespace and impliments the 
 * actual ray tracing functionality, it should be called as a worker 
 * thread from {@link app}
 * @name Tracer
 */

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

   /**
    * Trace for objects through the viewport
    * @param {Viewport} viewport The viewport to trace through
    * @returns {Uint8ClampedArray}
    */
   exports.trace = function(viewport) {
      var
              // Create bitmap array
              arr = new Uint8ClampedArray(viewport.width * viewport.height * 4),
              // Compute viewport dimensions
              halfX = viewport.right * 0.5,
              halfY = viewport.top * 0.5,
              // Compute FOV
              fovX = math.degToRad(viewport.fov),
              fovY = ((viewport.height / viewport.width) * fovX),
              // Precompute x and y increment
              xInc = ((1 / viewport.width) * Math.tan(fovX)),
              yInc = ((1 / viewport.height) * Math.tan(fovY));

      // Iterate over each pixel in viewport and cast a ray through it
      for (var j = 0; j < viewport.height; j++) {
         for (var i = 0; i < viewport.width; i++) {

            // Get world position of pixel
            var x = (-halfX + (i * xInc));
            var y = (halfY - (j * yInc));

            // Create a ray to cast
            var ray = new math.Ray(new math.Vect(), new math.Vect(x, y, -1));

            // If we intersect, change that pixel's color
            var index = ((i + j * viewport.width) * 4);
            if (tracer.castRay(ray) !== math.NO_INTERSECTION) {
               arr[index + 0] = 255;
               arr[index + 1] = 0;
               arr[index + 2] = 0;
               arr[index + 3] = 255;
            }
         }
      }
      return arr;
   };

   exports.clearShapes = function() {
      shapes = [];
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
         case "viewport":
            // Get data
            data = JSON.parse(e.data.data);

            // Reconstruct viewport
            var viewport = new math.Viewport(
                    data.width, data.height,
                    data.top, data.bottom, data.left, data.right,
                    data.near, data.far, data.fov);

            // Send back results
            self.postMessage({
               type: "result",
               data: tracer.trace(viewport)
            });
            break;
         case "clearshapes":
            // Clear out the shapes to be traced
            tracer.clearShapes();
            self.postMessage({
               type: "Notification",
               message: "Shapes have been cleared"
            });
            break;
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

            // Set shape ID
            tri.shapeId = data.shapeId;

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

            // Set shape ID
            sphere.shapeId = data.shapeId;

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
