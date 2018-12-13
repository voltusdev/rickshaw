Rickshaw.namespace("Rickshaw.Graph.Band");

Rickshaw.Graph.Band = Rickshaw.Class.create({
	initialize: function(args) {
		this.graph = args.graph;
	},

	render: function(args) {
		args = args || {};

		var graph = this.graph;
		var bands = args.bands || graph.bands;

		var vis = args.vis || graph.vis;
		bands.forEach(function(band) {
			var width = graph.x(band.to) - graph.x(band.from);
			if (band.name) {
				vis
					.insert("text", "path")
					.attr("x", graph.x(band.from) + width/2)
					.attr("y", 0)
					.attr("width", width)
					.attr("dy", "1em")
					.style("text-anchor", "middle")
					.text(band.name);
			}
			vis
				.insert("rect", "path")
				.attr("x", graph.x(band.from))
				.attr("y", 0)
				.attr("width", width)
				.attr("height", "100%")
				.attr("opacity", band.opacity)
				.attr("fill", band.color);
		}, this);
	}
});
