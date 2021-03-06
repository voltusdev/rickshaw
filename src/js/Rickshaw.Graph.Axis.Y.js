Rickshaw.namespace('Rickshaw.Graph.Axis.Y')

Rickshaw.Graph.Axis.Y = Rickshaw.Class.create({
  initialize: function(args) {
    this.graph = args.graph
    this.orientation = args.orientation || 'right'

    this.pixelsPerTick = args.pixelsPerTick || 75
    if (args.ticks) this.staticTicks = args.ticks
    if (args.tickValues) this.tickValues = args.tickValues

    this.tickSize = args.tickSize || 4
    this.ticksTreatment = args.ticksTreatment || 'plain'

    this.tickFormat =
      args.tickFormat ||
      function(y) {
        return y
      }

    this.berthRate = 0.1

    if (args.element) {
      this.element = args.element
      this.vis = d3
        .select(args.element)
        .append('svg:svg')
        .attr('class', 'rickshaw_graph y_axis')

      this.element = this.vis._groups[0][0]
      this.element.style.position = 'relative'

      this.setSize({ width: args.width, height: args.height })
    } else {
      this.vis = this.graph.vis
    }

    this.graph.onUpdate(
      function() {
        this.render()
      }.bind(this)
    )
  },

  setSize: function(args) {
    args = args || {}

    if (!this.element) return

    if (typeof window !== 'undefined') {
      var style = window.getComputedStyle(this.element.parentNode, null)
      var elementWidth = parseInt(style.getPropertyValue('width'), 10)

      if (!args.auto) {
        var elementHeight = parseInt(style.getPropertyValue('height'), 10)
      }
    }

    this.width = args.width || elementWidth || this.graph.width * this.berthRate
    this.height = args.height || elementHeight || this.graph.height

    this.vis
      .attr('width', this.width)
      .attr('height', this.height * (1 + this.berthRate))

  },

  render: function() {
    if (
      this._renderHeight !== undefined &&
      this.graph.height !== this._renderHeight
    )
      this.setSize({ auto: true })

    this.ticks =
      this.staticTicks || Math.floor(this.graph.height / this.pixelsPerTick)

    var axis = this._drawAxis(this.graph.y)

    this._drawGrid(axis)

    this._renderHeight = this.graph.height
  },

  _drawAxis: function(scale) {
    var axis = this._makeAxis(scale)
    axis.tickFormat(this.tickFormat)
    if (this.tickValues) axis.tickValues(this.tickValues)

    if (this.orientation == 'left') {
      var transform = 'translate(' + (this.width - 1) + ')'
    }

    if (this.element) {
      this.vis.selectAll('*').remove()
    }

    this.vis
      .append('svg:g')
      .attr('class', ['y_ticks', this.ticksTreatment].join(' '))
      .attr('transform', transform)
      .call(axis.ticks(this.ticks).tickSize(this.tickSize))

    return axis
  },

  _drawGrid: function(axis) {
    var gridSize = (this.orientation == 'right' ? 1 : -1) * this.graph.width

    this.graph.vis
      .append('svg:g')
      .attr('class', 'y_grid')
      .call(axis.ticks(this.ticks).tickSize(gridSize))
      .selectAll('text')
      .each(function() {
        this.parentNode.setAttribute('data-y-value', this.textContent)
      })
  },

  _makeAxis: function(scale) {
    if (this.orientation === 'left') {
      return d3.axisLeft(scale)
    }
    return d3.axisRight(scale)
  }
})
