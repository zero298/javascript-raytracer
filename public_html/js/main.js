/**
 * @fileOverview This file is the main file that holds the {@link app} namespace 
 * which implements application specific functions such as application 
 * initialization and input field value extraction
 * @name Main
 */

/**
 * Namespace for the ray tracing app
 * @namespace app
 */
var app = (function() {
   var exports = {};

   // Create the ray tracer worker thread
   var traceWorker = new Worker("js/tracer.js");

   // Handle messages from the worker
   traceWorker.onmessage = function(e) {

      // If we get a trace result, show it on screen
      if (e.data.type === "result") {
         var
                 // The canvas to draw on
                 traceCanvas = document.getElementById("traceCanvas"),
                 // Get the context of the canvas
                 ctx = traceCanvas.getContext("2d"),
                 // Create image data to put on the canvas
                 imageData = ctx.createImageData(traceCanvas.width, traceCanvas.height),
                 // Get the array from our message
                 arr = e.data.data;

         // Iterate over the bitmap passed by the message
         for (var j = 0; j < traceCanvas.height; j++) {
            for (var i = 0; i < traceCanvas.width; i++) {
               var index = ((i + j * traceCanvas.height) * 4);
               imageData.data[index + 0] = arr[index + 0];
               imageData.data[index + 1] = arr[index + 1];
               imageData.data[index + 2] = arr[index + 2];
               imageData.data[index + 3] = arr[index + 3];
            }
         }

         // Put the data into the canvas
         ctx.putImageData(imageData, 0, 0);

         // Notify user that ray tracer finished
         notifications.notify({
            title: "Tracing finished",
            body: "Ray tracer has completed",
            duration: 5000
         });
      }
      // Otherwise it's just a notification
      else {
         notifications.notify({
            title: e.data.type,
            body: e.data.message,
            duration: 5000
         });
         console.log(e.data.message);
      }
   };

   /**
    * Fallback function in case HTML5 notifications aren't supported
    * @param {Object} options
    * @param {String} options.title The title of the notification
    * @param {String} options.icon The location of the icon to use
    * @param {String} options.body The body of the notification
    * @param {String} options.tag The tag of the notification
    * @param {Number} options.duration How long the message will stay up
    */
   function notificationFallback(options) {
      var notificationFallbackSection = document.getElementById("notificationSection"),
              domNotification = document.createElement("div"),
              domNotificationTitle = document.createElement("h1"),
              domNotificationBody = document.createElement("p");

      // Set classes
      domNotification.className = "domNotification";
      domNotificationTitle.className = "domNotificationTitle";
      domNotificationBody.className = "domNotificationBody";

      // Set content
      domNotificationTitle.innerHTML = options.title || "";
      domNotificationBody.innerHTML = options.body || "";

      // Append to notification
      domNotification.appendChild(domNotificationTitle);
      domNotification.appendChild(domNotificationBody);

      // Append to DOM
      notificationFallbackSection.appendChild(domNotification);

      // If we have a duration, remove the notification after a while
      if (options.duration) {
         setTimeout(function() {
            notificationFallbackSection.removeChild(domNotification);
         }, options.duration);
      }
   }

   /**
    * Function to clear the notifications
    * @function
    */
   function clearNotifications() {
      var notificationFallbackSection = document.getElementById("notificationSection");
      notificationFallbackSection.innerHTML = "";
   }

   /**
    * Initialize the app
    * @function
    */
   exports.init = function() {
      notifications.setFallbackFunction(notificationFallback);
      document.getElementById("clearNotifications").addEventListener("click", clearNotifications);
      document.getElementById("trace").addEventListener("click", exports.createRay);
      document.getElementById("tri").addEventListener("click", exports.createTri);
      document.getElementById("sphere").addEventListener("click", exports.createSphere);
      document.getElementById("viewport").addEventListener("click", exports.createViewport);
   };

   /**
    * Entry point of app
    * @function
    */
   exports.main = function() {
   };

   exports.createViewport = function() {
      var
              // The canvas to draw on
              traceCanvas = document.getElementById("traceCanvas"),
              // Get the context of the canvas
              ctx = traceCanvas.getContext("2d"),
              // The viewport to send
              viewport = new math.Viewport(
                      ctx.width, ctx.height,
                      1, -1, -1, 1,
                      0.1, 100, 45);

      // Send over our viewport
      traceWorker.postMessage({
         type: "viewport",
         data: JSON.stringify(viewport)
      });
   };

   /**
    * Create a Ray from the dom inputs and send it to the worker
    * @function
    */
   exports.createRay = function() {
      var ray = new math.Ray(
              new math.Vect(
                      parseFloat(document.getElementById("rayOriginX").value),
                      parseFloat(document.getElementById("rayOriginY").value),
                      parseFloat(document.getElementById("rayOriginZ").value)),
              new math.Vect(
                      parseFloat(document.getElementById("rayDirectionX").value),
                      parseFloat(document.getElementById("rayDirectionY").value),
                      parseFloat(document.getElementById("rayDirectionZ").value)));
      traceWorker.postMessage({
         type: "ray",
         data: JSON.stringify(ray)
      });
   };

   /**
    * Create a triangle from the dom inputs and send it to the worker
    * @function
    */
   exports.createTri = function() {
      var tri = new math.Triangle(
              new math.Vect(
                      parseFloat(document.getElementById("triPoint1X").value),
                      parseFloat(document.getElementById("triPoint1Y").value),
                      parseFloat(document.getElementById("triPoint1Z").value)),
              new math.Vect(
                      parseFloat(document.getElementById("triPoint2X").value),
                      parseFloat(document.getElementById("triPoint2Y").value),
                      parseFloat(document.getElementById("triPoint2Z").value)),
              new math.Vect(
                      parseFloat(document.getElementById("triPoint3X").value),
                      parseFloat(document.getElementById("triPoint3Y").value),
                      parseFloat(document.getElementById("triPoint3Z").value)));
      traceWorker.postMessage({
         type: "tri",
         data: JSON.stringify(tri)
      });
   };

   /**
    * Create a sphere from the dom inputs and send it to the worker
    * @function
    */
   exports.createSphere = function() {
      var sphere = new math.Sphere(
              new math.Vect(
                      parseFloat(document.getElementById("sphereCenterX").value),
                      parseFloat(document.getElementById("sphereCenterY").value),
                      parseFloat(document.getElementById("sphereCenterZ").value)),
              parseFloat(document.getElementById("sphereRadius").value));
      traceWorker.postMessage({
         type: "sphere",
         data: JSON.stringify(sphere)
      });
   };

   exports.startTracer = function() {
      traceWorker.postMessage({
         type: "trace",
         data: "Test"
      });
   };

   return exports;
}());