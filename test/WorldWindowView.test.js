/*
 * Copyright 2015-2017 WorldWind Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
define([
    'src/BasicWorldWindowController',
    'src/render/DrawContext',
    'src/globe/EarthElevationModel',
    'src/globe/Globe',
    'src/globe/Globe2D',
    'src/LookAt',
    'src/geom/Matrix',
    'src/navigate/LookAtNavigator',
    'src/geom/Position',
    'src/geom/Rectangle',
    'test/util/TestUtils.test'
], function (BasicWorldWindowController, DrawContext, EarthElevationModel, Globe, Globe2D, LookAt, Matrix, LookAtNavigator, Position, Rectangle, TestUtils) {
    "use strict";

    var wwd = TestUtils.getMockWwd();

    describe("View tests", function () {

        describe("View calculations", function () {
            it("Correctly calculates viewing matrix", function () {
                var foo1=Matrix.fromIdentity();
                var foo2=Matrix.fromIdentity();

                if (foo1===foo2)
                    console.log("foo3");

                var testView = wwd.worldWindowView;
                testView.position = new Position(30, -110, 10e6);
                var result = Matrix.fromIdentity();
                testView.computeViewingTransform(result);
                var expectedModelview = new Matrix(
                    -0.3420201433256687, 0.0, 0.9396926207859083, 0.0,
                    0.46984631039295405, 0.8660254037844386, 0.17101007166283433, 18504.157,
                    -0.8137976813493737, 0.4999999999999999, -0.2961981327260238, -1.63727975559594E7,
                    0.0, 0.0, 0.0, 1.0);
                TestUtils.expectMatrixCloseTo(result, expectedModelview);
            });

            it("Correctly calculates camera from lookat", function () {
                var testView = wwd.worldWindowView;
                var lookAt = new LookAt();
                lookAt.range = 1.131761199603698E7;
                lookAt.lookAtPosition = new Position(30, -90, 0);
                testView.setFromLookAt(lookAt);
                expect(testView.position.latitude).toBeCloseTo(30.0, 6);
                expect(testView.position.longitude).toBeCloseTo(-90.0, 6);
                expect(testView.position.altitude).toBeCloseTo(1.131761199603698E7, 6);
                expect(testView.heading).toBeCloseTo(0, 6);
                expect(testView.tilt).toBeCloseTo(0, 6);
                expect(testView.roll).toBeCloseTo(0, 6);
            });

            it("Correctly calculates camera from transformed lookat", function () {
                var testView = wwd.worldWindowView;
                var lookAt = new LookAt();
                lookAt.range = 1.131761199603698E7;
                lookAt.tilt = 5;
                lookAt.roll = 5;
                lookAt.heading = 15;
                lookAt.lookAtPosition = new Position(30, -90, 0);
                testView.setFromLookAt(lookAt);
                expect(testView.position.latitude).toBeCloseTo(26.90254740059172, 6);
                expect(testView.position.longitude).toBeCloseTo(-90.92754733364956, 6);
                expect(testView.position.altitude).toBeCloseTo(11302122.347, 3);
                expect(testView.heading).toBeCloseTo(14.557895813118208, 6);
                expect(testView.tilt).toBeCloseTo(1.7970369431725128, 6);
                expect(testView.roll).toBeCloseTo(5, 6);
            });
        });
    });
});

