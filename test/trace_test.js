TraceTest = TestCase("TraceTest");

TraceTest.prototype.testViewport = function() {

   var testSphere = new math.Sphere(new math.Vect(0, 0, -1), 5);
   var testRay = new math.Ray(new math.Vect(0, 0, 0), new math.Vect(0, 0, -1));

   var width = 1, height = 1, near = -1, collisions = 0, xinc = 0.1, yinc = 0.1;

   for (var i = 0; i < width; i += xinc) {
      for (var j = 0; j < height; j += yinc) {

         // Set ray to point at "pixel"
         testRay.dir = math.subtract(new math.Vect(i, j, near), testRay.o);

         // Add to collisions if we intersect
         collisions += ((math.intersectRaySphere(testRay, testSphere) !== math.getNoIntersection()) ? 1 : 0);

      }
   }

   // Print number of collisions
   console.log("Num collisions: " + collisions);

   assertTrue("Must intersect at least once", (collisions > 0));
};