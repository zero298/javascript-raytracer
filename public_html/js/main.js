var app = (function() {
   var exports = {};

   var traceWorker = new Worker("js/tracer.js");

   traceWorker.onmessage = function(e) {
      notifications.notify({
         title: e.data.type,
         body: e.data.message,
         duration: 5000
      });
      console.log(e.data.message);
   };
   exports.init = function() {
      document.getElementById("trace").addEventListener("click", exports.createRay);
      document.getElementById("tri").addEventListener("click", exports.createTri);
      document.getElementById("sphere").addEventListener("click", exports.createSphere);
   };
   exports.main = function() {
   };
   exports.createRay = function() {
      var ray = new math.Ray(
              new math.Vect(
                      document.getElementById("rayOriginX").value,
                      document.getElementById("rayOriginY").value,
                      document.getElementById("rayOriginX").value),
              new math.Vect(
                      document.getElementById("rayDirectionX").value,
                      document.getElementById("rayDirectionY").value,
                      document.getElementById("rayDirectionZ").value));
      traceWorker.postMessage({
         type: "ray",
         data: JSON.stringify(ray)
      });
   };
   exports.createTri = function() {
      var tri = new math.Triangle(
              new math.Vect(
                      document.getElementById("triPoint1X").value,
                      document.getElementById("triPoint1Y").value,
                      document.getElementById("triPoint1Z").value),
              new math.Vect(
                      document.getElementById("triPoint2X").value,
                      document.getElementById("triPoint2Y").value,
                      document.getElementById("triPoint2Z").value),
              new math.Vect(
                      document.getElementById("triPoint3X").value,
                      document.getElementById("triPoint3Y").value,
                      document.getElementById("triPoint3Z").value));
      traceWorker.postMessage({
         type: "tri",
         data: JSON.stringify(tri)
      });
   };
   exports.createSphere = function() {
      var sphere = new math.Sphere(
              new math.Vect(
                      document.getElementById("sphereCenterX").value,
                      document.getElementById("sphereCenterY").value,
                      document.getElementById("sphereCenterZ").value),
              document.getElementById("sphereRadius").value);
      traceWorker.postMessage({
         type: "sphere",
         data: JSON.stringify(sphere)
      });
   };

   return exports;
}());