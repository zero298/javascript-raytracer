var app = (function() {
   var exports = {};

   var traceWorker = new Worker("js/tracer.js");

   traceWorker.onmessage = function(e) {
      notifications.notify({
         title: e.data.type,
         body: e.data.message,
         duration: 5000
      });
      console.log(e.data);
   };
   exports.init = function() {
      document.getElementById("trace").addEventListener("click", exports.createRay);
      document.getElementById("tri").addEventListener("click", exports.createTri);
   };
   exports.main = function() {

   };
   /**
    * Cast a ray at trianbles
    * @param {Ray} ray
    * @returns {undefined}
    */
   exports.trace = function(ray) {

   };
   /**
    * Add a Triangle to be traced
    * @param {Triangle} tri
    * @returns {undefined}
    */
   exports.addTri = function(tri) {

   };
   exports.createRay = function() {
      var ray = new math.Ray(
              new math.Point(
                      document.getElementById("rayOriginX").value,
                      document.getElementById("rayOriginY").value,
                      document.getElementById("rayOriginX").value),
              new math.Vect(
                      document.getElementById("rayDirectionX").value,
                      document.getElementById("rayDirectionY").value,
                      document.getElementById("rayDirectionZ").value));
      traceWorker.postMessage({
         type: "ray",
         data: JSON.stringify(ray),
         duration: 5000
      });
   };
   exports.createTri = function() {
      var tri = new math.Triangle(
              new math.Point(
                      document.getElementById("triPoint1X").value,
                      document.getElementById("triPoint1Y").value,
                      document.getElementById("triPoint1Z").value),
              new math.Point(
                      document.getElementById("triPoint2X").value,
                      document.getElementById("triPoint2Y").value,
                      document.getElementById("triPoint2Z").value),
              new math.Point(
                      document.getElementById("triPoint3X").value,
                      document.getElementById("triPoint3Y").value,
                      document.getElementById("triPoint3Z").value));
      traceWorker.postMessage({
         type: "tri",
         data: JSON.stringify(tri),
         duration: 5000
      });
   };

   return exports;
}());