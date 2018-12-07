Rickshaw.namespace('Rickshaw.Graph.DragZoom');

Rickshaw.Graph.DragZoom = Rickshaw.Class.create({

	initialize: function(args) {
		if (!args || !args.graph) {
			throw new Error("Rickshaw.Graph.DragZoom needs a reference to a graph");
		}
		var defaults = {
			opacity: 0.5,
			fill: 'steelblue',
			minimumTimeSelection: 60,
			callback: function() {}
		};

		this.graph = args.graph;
		this.svg = d3.select(this.graph.element).select("svg");
		this.svgWidth = parseInt(this.svg.attr("width"), 10);
		this.opacity = args.opacity || defaults.opacity;
		this.fill = args.fill || defaults.fill;
		this.minimumTimeSelection = args.minimumTimeSelection || defaults.minimumTimeSelection;
		this.callback = args.callback || defaults.callback;

		this.registerMouseEvents();
	},

	registerMouseEvents: function() {
		var self = this;
		var ESCAPE_KEYCODE = 27;
		var rectangle;

		var drag = {
			startDt: null,
			stopDt: null,
			startPX: null,
			stopPX: null
		};

		var timer;

		//this.svg.on("mousedown", onMousedown);

		this.svg.on("pointerdown", eventHandler);

		function onMouseup(datum, index) {
			console.log("Mouse up", this);
			drag.stopDt = pointAsDate(d3.event);
			var windowAfterDrag = [
				drag.startDt,
				drag.stopDt
			].sort(compareNumbers);

			self.graph.window.xMin = windowAfterDrag[0];
			self.graph.window.xMax = windowAfterDrag[1];

			var endTime = self.graph.window.xMax;
			var range = self.graph.window.xMax - self.graph.window.xMin;

			reset(this);
			if (range < self.minimumTimeSelection || isNaN(range)) {
				return;
			}
			self.graph.update();
			self.callback({range: range, endTime: endTime});
		}

		function onMousemove() {
			var el = d3.select("svg");

			var offset = drag.stopPX = (d3.event.offsetX || d3.event.layerX);
			if (offset > (self.svgWidth - 1) || offset < 1) {
				return;
			}

			var limits = [drag.startPX, offset].sort(compareNumbers);
			var selectionWidth = limits[1]-limits[0];
			if (isNaN(selectionWidth)) {
				return reset(this);
			}
			console.log();
			rectangle.attr("fill", self.fill)
			.style("opacity", self.opacity)
			.attr("x", limits[0])
			.attr("width", selectionWidth);
		}

		function onPointerDown(){
			console.log('pointerDown');
			var el = d3.select(this);
				if(d3.event.preventDefault) {
					d3.event.preventDefault();
				} else {
					d3.event.returnValue = false;
				}

			drag.target = d3.event.target;
			drag.startDt = pointAsDate(d3.event);
			drag.startPX = d3.event.offsetX || d3.event.layerX;

			rectangle = el.append("rect")
			.style("opacity", 0)
			.attr("y", 0)
			.attr("height", "100%");

			el.on("pointermove", onMousemove);
			d3.select(document).on("pointerup", onMouseup);
			d3.select(document).on("keyup", function() {
				if (d3.event.keyCode === ESCAPE_KEYCODE) {
					reset(this);
				}
			});
		}

		function eventHandler() {
			var e = d3.event;
			if (e.pointerType === "touch"){
				var touchSelect = onPointerDown.bind(this);
				timer = setTimeout(touchSelect, 1000);

				d3.select(document).on("pointerup", onPointerupTimer);
				d3.select(this).on("pointermove", onPointerMoveTimer);
			} else {
				var mouseClick = onPointerDown.bind(this);
				mouseClick();
			}
		}

		function onPointerupTimer(){
			if(timer) {
				clearTimeout(timer);
				console.log('lifted touch, too short');
			}

		}

		function onPointerMoveTimer(){
			if(timer) {
				clearTimeout(timer);
				console.log('moved touch, too short');
			}
		}

		function reset(el) {
			console.log('reset');
			var s = d3.select(el);
			s.on("mousemove", null);
			d3.select(document).on("mouseup", null);
			drag = {};
			rectangle.remove();
		}

		function compareNumbers(a, b) {
			return a - b;
		}

		function pointAsDate(e) {
			return Math.floor(self.graph.x.invert(e.offsetX || e.layerX));
		}
	}
});
