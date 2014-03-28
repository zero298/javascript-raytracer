var app = (function() {
   var exports = {};

   var traceWorker = new Worker("js/tracer.js");

   traceWorker.onmessage = function(e) {
      notifications.notify({
         title: e.data.type,
         body: e.data.message
      });
      console.log(e.data);
   };
   exports.init = function() {
      document.getElementById("trace").addEventListener("click", exports.createRay);
      document.getElementById("tri").addEventListener("click", exports.createTri);
      document.getElementById("notify").addEventListener("click", function() {
         notifications.notify({
            title: "Test",
            body: "This is just a test and SHOULD disappear",
            duration: 5000
         });
      });
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
              document.getElementById("rayX").value,
              document.getElementById("rayY").value,
              document.getElementById("rayZ").value);
      traceWorker.postMessage({
         type: "ray",
         data: JSON.stringify(ray)
      });
   };
   exports.createTri = function() {
      var tri = new math.Triangle(
              new math.Point(-1, -1, 0),
              new math.Point(0, 1, 0),
              new math.Point(1, -1, 0));
      traceWorker.postMessage({
         type: "tri",
         data: JSON.stringify(tri)
      });
   };

   return exports;
}());