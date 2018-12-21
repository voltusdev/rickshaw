Rickshaw.namespace('Rickshaw.Graph.TapZoom')

Rickshaw.Graph.TapZoom = Rickshaw.Class.create({
  initialize: function(args) {
    if (!args || !args.graph) {
      throw new Error('Rickshaw.Graph.TapZoom needs a reference to a graph')
    }
    var defaults = {
      zoomAmount: 50,
      maxZoomed: 60,
      callback: function() {}
    }

    this.graph = args.graph
    this.svg = d3.select(this.graph.element).select('svg')
    this.svgWidth = parseInt(this.svg.attr('width'), 10)
    this.zoomAmount = args.zoomAmount || defaults.zoomAmount
    this.maxZoomed = args.maxZoomed || defaults.maxZoomed
    this.callback = args.callback || defaults.callback

    this.registerTouchEvents()
  },

  registerTouchEvents: function() {
    var self = this
    var taps = []
    var doubleTapTimeLimit = 300
    var domain = this.graph.dataDomain()

    var chart = d3
      .select('.rickshaw_graph')
      .style('touch-action', 'manipulation')

    this.svg.on('touchstart', onTouchStart)

    function onTouchStart() {
      taps.push(d3.event.timeStamp)

      d3.event.preventDefault()

      if (self.graph.window.xMin === undefined) {
        self.graph.window.xMin = domain[0]
      }

      if (self.graph.window.xMax === undefined) {
        self.graph.window.xMax = domain[1]
      }

      if (
        taps.length > 1 &&
        taps[taps.length - 1] - taps[taps.length - 2] < doubleTapTimeLimit
      ) {
        zoomChart()
      }
    }

    function zoomChart() {
      self.graph.window.xMin = self.graph.window.xMin + self.zoomAmount
      self.graph.window.xMax = self.graph.window.xMax - self.zoomAmount

      if (self.graph.window.xMax - self.graph.window.xMin < self.maxZoomed) {
        return
      }

      self.graph.update()
      taps = []
      self.callback()
    }
  }
})

Rickshaw.namespace('Rickshaw.Graph.TapZoom');

Rickshaw.Graph.TapZoom = Rickshaw.Class.create({

	initialize: function(args) {
		if (!args || !args.graph) {
			throw new Error("Rickshaw.Graph.TapZoom needs a reference to a graph");
		}
		var defaults = {
			zoomAmount: 50,
			maxZoomed: 60,
			callback: function() {}
		};

		this.graph = args.graph;
		this.svg = d3.select(this.graph.element).select("svg");
		this.svgWidth = parseInt(this.svg.attr("width"), 10);
		this.zoomAmount = args.zoomAmount || defaults.zoomAmount;
		this.maxZoomed = args.maxZoomed || defaults.maxZoomed;
		this.callback = args.callback || defaults.callback;

		this.registerTouchEvents();
	},

	registerTouchEvents: function() {
		var self = this;
		var taps = [];
		var doubleTapTimeLimit = 300;
		var domain = this.graph.dataDomain();

		var chart = d3.select('.rickshaw_graph')
			.style("touch-action", "manipulation");

		this.svg.on("touchstart", onTouchStart);

		function onTouchStart(){
			taps.push(d3.event.timeStamp);

			d3.event.preventDefault();

			if (self.graph.window.xMin === undefined) {
				self.graph.window.xMin = domain[0];
			}

			if (self.graph.window.xMax === undefined) {
				self.graph.window.xMax = domain[1];
			}

			if (taps.length > 1 && taps[taps.length - 1] - taps[taps.length - 2] < doubleTapTimeLimit) {
				zoomChart();
			}
		}

		function zoomChart(){
			self.graph.window.xMin = self.graph.window.xMin + self.zoomAmount;
			self.graph.window.xMax = self.graph.window.xMax - self.zoomAmount;

			if (self.graph.window.xMax - self.graph.window.xMin < self.maxZoomed) {
				return;
			}

			self.graph.update();
			taps = [];
			self.callback();
		}
	}
});
