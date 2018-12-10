Rickshaw.namespace('Rickshaw.Graph.TouchZoom');

Rickshaw.Graph.TouchZoom = Rickshaw.Class.create({

	initialize: function(args) {
		if (!args || !args.graph) {
			throw new Error("Rickshaw.Graph.TouchZoom needs a reference to a graph");
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
    var selection = [];

    this.svg.on("touchstart", onTouchstart);

    function onTouchend(){
      console.log(selection.length);
      if(selection.length === 2){
        var sortedSelection = selection.sort();

        self.graph.window.xMin = sortedSelection[0];
        self.graph.window.xMax = sortedSelection[1];

        var endTime = self.graph.window.xMax;
        var range = self.graph.window.xMax - self.graph.window.xMin;

        reset(this);

  			if (range < self.minimumTimeSelection || isNaN(range)) {
  				return;
  			}
  			self.graph.update();
  			self.callback({range: range, endTime: endTime});
      } else {
        return;
      }
    }

    function onTouchstart(){
      if(d3.event.preventDefault) {
        d3.event.preventDefault();
      } else {
        d3.event.returnValue = false;
      }

			var date = pointAsDate(d3.event);
      selection.push(date);
      d3.select(document).on("touchend", onTouchend);

    }

		function reset(el) {
			d3.select(document).on("touchend", null);
			selection = [];
		}

    function pointAsDate(e) {
			return Math.floor(self.graph.x.invert(e.touches[0].clientX || e.touches[0].pageX));
		}
	}
});
