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
    * @param {Ray} ray The ray to cast with
    * @returns {RayCastResult} Object containing intersection result
    * @returns {RayCastResult.t} Point along ray of intersection
    * @returns {RayCastResult.nearest} Nearest object index
    */
   exports.castRay = function(ray) {
      var nearest = new math.CollisionRecord(math.getNoIntersection());
      var result = nearest;
      var nearestShapeIndex = -1;
      for (var i = 0; i < shapes.length; i++) {
         // Get the intersection result
         result = math.intersect(ray, shapes[i]);

         // Keep track of the nearest shape
         if (result.t < nearest.t) {
            nearest = result;
            nearestShapeIndex = i;
         }
      }

      return {
         t: nearest.t,
         nearest: nearestShapeIndex
      };
   };

   /**
    * Add a Triangle to the list of tris to collide against
    * @param {Shape} shape
    */
   exports.addShape = function(shape) {
      shapes.push(shape);
   };

   /**
    * Add random shapes to the tracer
    * @param {Number} num The number of shapes to add
    */
   exports.randomShapes = function(num) {
      num = num || 5;
      var shape;
      for (var i = 0; i < num; i++) {
         switch (Math.ceil(Math.random() * 2)) {
            case 1:
               shape = math.randomizer.randomTri();
               break;
            case 2:
               shape = math.randomizer.randomSphere();
               break;
            default:
               shape = math.randomizer.randomSphere();
               console.log("Shouldn't be here: " + switchvar);
               break;

         }
         // Add the shape
         tracer.addShape(shape);
      }
   };

   /**
    * A bunch of spheres to show lighting errors
    */
   exports.gridSphere = function() {
      var material = new math.Material();
      for (var i = -5; i <= 5; i++) {
         for (var j = -5; j <= 5; j++) {
            var newSphere = new math.Sphere(new math.Vect(i, j, -10), 0.5);
            newSphere.material = material;
            tracer.addShape(newSphere);
         }
      }
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

      // Lets pretend we already have a point light to use
      var lightPos = new math.Vect(10, 10, 10);

      // Iterate over each pixel in viewport and cast a ray through it
      for (var j = 0; j < viewport.height; j++) {
         for (var i = 0; i < viewport.width; i++) {

            // Get world position of pixel
            var x = (-halfX + (i * xInc));
            var y = (halfY - (j * yInc));

            // Create a ray to cast
            var ray = new math.Ray(new math.Vect(), new math.Vect(x, y, -1));

            // See which pixel we're altering
            var index = ((i + j * viewport.width) * 4);

            // Get the cast result
            var result = tracer.castRay(ray);

            // If we intersect, change that pixel's color
            if (result.t !== math.NO_INTERSECTION) {

               // Get the intersection point
               var intersectionPoint = ray.getPoint(result.t);

               // Get the direction to the light
               var dirToLight = math.normalize(math.subtract(lightPos, intersectionPoint));

               // Get a color to work with
               var nearestObject = shapes[result.nearest];

               // Get the color of the shape
               var material = nearestObject.material;

               // Get the normal of the intersection
               var normal = nearestObject.getNormal(intersectionPoint);

               // Get the normal dot the light direction
               var NdotL = math.dot(normal, dirToLight);

               // Scale the color with the NdotL
               var ambient = material.ambient;
               var diffuse = math.scale(material.diffuse, NdotL);

               // Sum components
               var finalColor = math.add(ambient, diffuse);

               // Set the pixel color
//               arr[index + 0] = Math.round(finalColor.x * 255);
//               arr[index + 1] = Math.round(finalColor.y * 255);
//               arr[index + 2] = Math.round(finalColor.z * 255);
//               arr[index + 3] = 255;

               arr[index + 0] = Math.round(normal.x * 255);
               arr[index + 1] = Math.round(normal.y * 255);
               arr[index + 2] = Math.round(normal.z * 255);
               arr[index + 3] = 255;
            }
         }
      }
      return arr;
   };

   /**
    * Remove all the shapes from the tracer
    * @function
    */
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
         case "random":
//            tracer.randomShapes();
            tracer.gridSphere();

            self.postMessage({
               type: "Notification",
               message: "Random shapes added"
            });
            break;
         case "viewport":
            // Get data
            data = JSON.parse(e.data.data);

            // Reconstruct viewport
            var viewport = new math.Viewport(
                    data.width, data.height,
                    data.top, data.bottom, data.left, data.right,
                    data.near, data.far, data.fov);

            // Send back results
            console.profile("Tracer Profile");
            var result = tracer.trace(viewport);
            console.profileEnd("Tracer Profile");

            self.postMessage({
               type: "result",
               data: result
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

            // Set color
            tri.material = math.randomizer.randomMaterial();

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

            // Set color
            sphere.material = math.randomizer.randomMaterial();

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
