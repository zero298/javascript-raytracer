MathTest = TestCase("MathTest");

// Test equality of two vectors with tolerance
MathTest.prototype.testEquality = function() {
   var vect1 = new math.Vect(1, 2, 3);
   var vect2 = new math.Vect(1, 2, 3);

   assertEqualsDelta("Vects must be equal",
           vect1, vect2, math.getTolerance());
};

// Test addition of vectors
MathTest.prototype.testAddition = function() {
   var vectAddend1 = new math.Vect(1, 2, 3);
   var vectAddend2 = new math.Vect(4, 5, 6);

   var vectExpectedSum = new math.Vect(5, 7, 9);
   var vectActualSum = math.add(vectAddend1, vectAddend2);

   assertEqualsDelta("Expected sum must equal actual",
           vectExpectedSum, vectActualSum, math.getTolerance());
};

// Test projection of vectors onto one another
MathTest.prototype.testProjection = function() {
   var vect1 = new math.Vect(2, 4, 6);
   var vect2 = new math.Vect(4, 5, 6);

   var vectExpectedProjection = new math.Vect(3.32467, 4.15584, 4.98701);
   var vectActualProjection = new math.projection(vect1, vect2);

   assertEqualsDelta("Expected projection must equal actual",
           vectExpectedProjection, vectActualProjection, math.getTolerance());
};

// Test intersection of ray and sphere
MathTest.prototype.testRaySphereIntersection = function() {
   // Test Ray
   var ray = new math.Ray(
           new math.Vect(0, 0, 0),
           new math.Vect(0, 0, -1));

   // Sphere is in front of the ray
   assertEqualsDelta("Ray must intersect at point",
           // Expected intersection
           new math.Vect(0, 0, -4),
           ray.getPoint(
                   math.intersectRaySphere(
                           // Ray starting at origin
                           ray,
                           // Sphere in front of ray
                           new math.Sphere(
                                   new math.Vect(0, 0, -5),
                                   1))),
           // Tolerance
           math.getTolerance());

   // Sphere encloses ray
   assertEqualsDelta("Ray must intersect at point",
           // Expected intersection
           new math.Vect(0, 0, -1),
           ray.getPoint(
                   math.intersectRaySphere(
                           // Ray starting at origin
                           ray,
                           // Sphere at origin
                           new math.Sphere(
                                   new math.Vect(0, 0, 0),
                                   1))),
           // Tolerance
           math.getTolerance());

   // Edge of sphere is right at ray origin
   assertEqualsDelta("Ray must intersect at point",
           // Expected intersection
           new math.Vect(0, 0, 0),
           ray.getPoint(
                   math.intersectRaySphere(
                           // Ray starting at origin
                           ray,
                           // Sphere in front of ray
                           new math.Sphere(
                                   new math.Vect(0, 0, 1),
                                   1))),
           // Tolerance
           math.getTolerance());

   // No intersection
   assertEquals("Ray should not intersect with sphere",
           math.getNoIntersection(),
           math.intersectRaySphere(
                   ray,
                   new math.Sphere(
                           new math.Vect(0, 5, -5),
                           0.5)));
};

// Test intersection of ray and triangle
MathTest.prototype.testRayTriangleIntersection = function() {
   var ray = new math.Ray(
           new math.Vect(0, 0, 0),
           new math.Vect(0, 0, -1));

   // Ray should intersect triangle in front
   assertEqualsDelta("Ray must intersect at point",
           new math.Vect(0, 0, -5),
           ray.getPoint(
                   math.intersectRayTri(
                           ray,
                           new math.Triangle(
                                   new math.Vect(-1, -1, -5),
                                   new math.Vect(1, -1, -5),
                                   new math.Vect(0, 1, -5)))),
           math.getTolerance());

   // Ray should not intersect
   assertEquals("Ray must NOT intersect at point",
           math.getNoIntersection(),
           math.intersectRayTri(
                   ray,
                   new math.Triangle(
                           new math.Vect(-1, -1, 5),
                           new math.Vect(1, -1, 5),
                           new math.Vect(0, 1, 5))));
};