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

   // Do notifications whenever we hear back from worker
   traceWorker.onmessage = function(e) {
      notifications.notify({
         title: e.data.type,
         body: e.data.message,
         duration: 5000
      });
      console.log(e.data.message);
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
   };

   /**
    * Entry point of app
    * @function
    */
   exports.main = function() {
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

   return exports;
}());