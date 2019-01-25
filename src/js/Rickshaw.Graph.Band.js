Rickshaw.namespace('Rickshaw.Graph.Band')

Rickshaw.Graph.Band = Rickshaw.Class.create({
  initialize: function(args) {
    this.graph = args.graph
  },

  render: function(args) {
    args = args || {}

    var graph = this.graph
    var bands = args.bands || graph.bands
    var vis = args.vis || graph.vis

    var config = graph.renderer.config
    var configRenderer = !!config && config.renderer

    bands.forEach(function(band, i) {
      vis.select('#band-' + i).remove()
      vis.select('#band-text-' + i).remove()

      var width = graph.x(band.to) - graph.x(band.from)
      vis
        .insert('rect', ':first-child')
        .attr('id', 'band-' + i)
        .attr('x', graph.x(band.from))
        .attr('y', 0)
        .attr('width', width)
        .attr('height', '100%')
        .attr('opacity', band.opacity)
        .attr('fill', band.color)
      if (band.name) {
        vis
          .insert('text', ':first-child')
          .attr('id', 'band-text-' + i)
          .attr('x', graph.x(band.from) + width / 2)
          .attr('y', 0)
          .attr('width', width)
          .attr('dy', '1.2em')
          .style('text-anchor', 'middle')
          .style('font-size', '12px')
          .style('fill', '#000000')
          .style('opacity', '0.5')
          .text(band.name)
      }
    }, this)
  }
})
