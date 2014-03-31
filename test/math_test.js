MathTest = TestCase("MathTest");

MathTest.prototype.testAddition = function() {
   var VectAddend1 = new math.Vect(1, 2, 3);
   var VectAddend2 = new math.Vect(4, 5, 6);

   var VectExpectedSum = new math.Vect(5, 7, 9);
   var VectSum = math.add(VectAddend1, VectAddend2);
   assertTrue("Sum must be equal", (
           (VectSum.x === VectExpectedSum.x) &&
           (VectSum.y === VectExpectedSum.y) &&
           (VectSum.z === VectExpectedSum.z) &&
           (VectSum.w === VectExpectedSum.w)));
};

MathTest.prototype.testProjection = function() {
   var Vect1 = new math.Vect(0, 0, 0);
   var Vect2 = new math.Vect(0, 0, 0);
   assertTrue("Projection must be correct", false);
};