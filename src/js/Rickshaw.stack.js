Rickshaw.namespace("Rickshaw.stack");

// A function that works like d3 v3's d3.layout.stack(),
// implemented using d3 v4's d3.stack().
Rickshaw.stack = function(data, offsetFn) {
	offsetFn = offsetFn || d3.stackOffsetNone;

	var layout = d3.stack()
		.keys(Object.keys(data))
		.value(function(d, i) { return d[i].y })
		.offset(offsetFn);
	var transposed = d3.transpose(data);
	var stackedData = layout(transposed);
	stackedData.forEach(function(series, i) {
		stackedData[i] = series.map(function(d) {
			return {x: d.data[0].x, y0: d[0], y: d[1] - d[0]};
		});
	});
	return stackedData;
};
