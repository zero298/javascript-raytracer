MathTest = TestCase("MathTest");

MathTest.prototype.testEquality = function() {
   var vect1 = new math.Vect(1, 2, 3);
   var vect2 = new math.Vect(1, 2, 3);

   assertEqualsDelta("Vects must be equal",
           vect1, vect2, math.getTolerance());
};

MathTest.prototype.testAddition = function() {
   var vectAddend1 = new math.Vect(1, 2, 3);
   var vectAddend2 = new math.Vect(4, 5, 6);

   var vectExpectedSum = new math.Vect(5, 7, 9);
   var vectActualSum = math.add(vectAddend1, vectAddend2);

   assertEqualsDelta("Expected sum must equal actual",
           vectExpectedSum, vectActualSum, math.getTolerance());
};

MathTest.prototype.testProjection = function() {
   var vect1 = new math.Vect(2, 4, 6);
   var vect2 = new math.Vect(4, 5, 6);

   var vectExpectedProjection = new math.Vect(3.32467, 4.15584, 4.98701);
   var vectActualProjection = new math.projection(vect1, vect2);

   assertEqualsDelta("Expected projection must equal actual",
           vectExpectedProjection, vectActualProjection, math.getTolerance());
};

MathTest.prototype.testRaySphereIntersection = function() {
   var ray = new math.Ray(
           new math.Vect(0, 0, 0),
           new math.Vect(0, 0, -1));

   var goodSphere = new math.Sphere(
           new math.Vect(0, 0, -5),
           1);

   var badSphere = new math.Sphere(
           new math.Vect(0, 5, -5),
           0.5);

   assertTrue("Ray should intersect with good sphere",
           math.intersectRaySphere(ray, goodSphere));

   assertFalse("Ray should NOT intersect with bad sphere",
           math.intersectRaySphere(ray, badSphere));
};

MathTest.prototype.testRayTriangleIntersection = function() {
   var ray = new math.Ray(
           new math.Vect(0, 0, 0),
           new math.Vect(0, 0, -1));

   var tri = new math.Triangle(
           new math.Vect(-1, -1, -5),
           new math.Vect(1, -1, -5),
           new math.Vect(0, 1, -5));

   assertTrue("Ray should intersect with triangle",
           math.intersectRayTri(ray, tri));
};