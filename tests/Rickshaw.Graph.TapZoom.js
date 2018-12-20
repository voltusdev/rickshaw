var d3 = require("d3");
var Rickshaw;

exports.setUp = function(callback) {
	Rickshaw = require('../rickshaw');

	global.document = require("jsdom").jsdom("<html><head></head><body></body></html>");
	global.window = document.defaultView;

	new Rickshaw.Compat.ClassList();

	var element = document.createElement("div");

	//create a graph to run the tests on
	var graph = new Rickshaw.Graph({
		element: element,
		width: 960,
		height: 500,
		renderer: 'scatterplot',
		series: [{
			color: 'steelblue',
			data: [{
				x: 0,
				y: 40
			}, {
				x: 1,
				y: 49
			}, {
				x: 2,
				y: 38
			}, {
				x: 3,
				y: 30
			}, {
				x: 4,
				y: 32
			}]
		}]
	});

	graph.renderer.dotSize = 6;
	graph.render();

	callback();
};

exports.tearDown = function(callback) {
	delete require.cache.d3;
	callback();
};

//test that multiple touches in succesion produce expected behavior
exports.touch = function(test) {
	var zoomNumber = 50;

	var tap = new Rickshaw.Graph.TapZoom({
		graph: graph,
		zoomAmount: zoomNumber
	});
	//tests that the graph has renered correctly
	test.equal(graph.renderer.name, tap.graph.renderer.name);

	//create a touch event inside the graph
	var event = document.createEvent('MouseEvent');
	event.initMouseEvent("touchstart", true, true, window, 1, 800, 600, 290, 260,
	  false, false, false, false, 0, null);

	//test that the touch event is firing where expected
	test.equal(event.screenX, 800, 'jsdom initMouseEvent works');

	var originalDomain = tap.graph.dataDomain();
	tap.svg._groups[0][0].dispatchEvent(event);
	//tests that after one tap, the xMin and xMax have updated from undefined
	//to the outer limits of the graph
	test.equal(tap.graph.window.xMin, originalDomain[0], 'xMin updated');
	test.equal(tap.graph.window.xMax, originalDomain[1], 'xMax updated');


	tap.svg._groups[0][0].dispatchEvent(event);
	//tests that after two taps in succesion xMin increases by the zoomAmount and
	//xMax decreases byt the zoomAmount
	test.equal(tap.graph.window.xMin, originalDomain[0] + zoomNumber, 'double tap zooms xMin in');
	test.equal(tap.graph.window.xMax, originalDomain[1] - zoomNumber, 'double tap zooms xMax in');

	test.done();
}
