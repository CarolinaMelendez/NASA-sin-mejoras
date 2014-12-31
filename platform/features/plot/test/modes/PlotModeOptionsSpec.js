/*global define,Promise,describe,it,expect,beforeEach,waitsFor,jasmine*/

/**
 * MergeModelsSpec. Created by vwoeltje on 11/6/14.
 */
define(
    ["../../src/modes/PlotModeOptions"],
    function (PlotModeOptions) {
        "use strict";

        describe("Plot mode options", function () {
            var mockDomainObject,
                mockSubPlotFactory;

            beforeEach(function () {
                mockDomainObject = jasmine.createSpyObj(
                    "domainObject",
                    [ "getId", "getModel", "getCapability" ]
                );
                mockSubPlotFactory = jasmine.createSpyObj(
                    "subPlotFactory",
                    [ "createSubPlot" ]
                );
            });

            it("offers only one option when one object is present", function () {
                expect(
                    new PlotModeOptions([mockDomainObject], mockSubPlotFactory)
                            .getModeOptions().length
                ).toEqual(1);
            });

            it("offers two options when multiple objects are present", function () {
                var objects = [
                        mockDomainObject,
                        mockDomainObject,
                        mockDomainObject,
                        mockDomainObject
                    ];
                expect(
                    new PlotModeOptions(objects, mockSubPlotFactory)
                            .getModeOptions().length
                ).toEqual(2);
            });

            it("allows modes to be changed", function () {
                var plotModeOptions = new PlotModeOptions([
                        mockDomainObject,
                        mockDomainObject,
                        mockDomainObject,
                        mockDomainObject
                    ], mockSubPlotFactory),
                    initialHandler = plotModeOptions.getModeHandler();

                // Change the mode
                plotModeOptions.getModeOptions().forEach(function (option) {
                    if (option !== plotModeOptions.getMode()) {
                        plotModeOptions.setMode(option);
                    }
                });

                // Mode should be different now
                expect(plotModeOptions.getModeHandler())
                    .not.toBe(initialHandler);
            });
        });
    }
);