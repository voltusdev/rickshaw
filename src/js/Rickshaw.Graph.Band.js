Rickshaw.namespace("Rickshaw.Graph.Band");

Rickshaw.Graph.Band = Rickshaw.Class.create({
	defaults: function() {
		var defaults = Rickshaw.extend(this._renderer.defaults(), {
			gapSize: 0.05,
			unstack: false,
			opacity: 1.0
		});

		delete defaults.tension;
		return defaults;
	},

	initialize: function(args) {
		this._renderer = new Rickshaw.Graph.Renderer(args);
		this.graph = args.graph;
	},

	domain: function() {
		return this._renderer.domain();
	},

	render: function(args) {
		args = args || {};

		var graph = this.graph;
		var bands = args.bands || graph.bands;
		var barWidth = 0; //TODO
		var barXOffset = 0;

		var vis = args.vis || graph.vis;
		var domain = this.domain();
		bands.forEach(function(band) {
			var nodes = vis
				.insert("rect", "path")
				.attr("x", graph.x(band.from) + barXOffset)
				.attr("y", 0)
				.attr("width", graph.x(band.to) - graph.x(band.from))
				.attr("height", "100%")
				.attr("opacity", band.opacity)
				.attr("fill", band.color);
		}, this);
	}
});
