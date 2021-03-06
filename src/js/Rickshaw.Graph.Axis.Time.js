Rickshaw.namespace('Rickshaw.Graph.Axis.Time')

Rickshaw.Graph.Axis.Time = function(args) {
  this.graph = args.graph
  this.elements = []
  this.ticksTreatment = args.ticksTreatment || 'plain'
  this.fixedTimeUnit = args.timeUnit

  var time = args.timeFixture || new Rickshaw.Fixtures.Time()

  this.appropriateTimeUnit = function() {
    var unit
    var units = time.units

    var domain = this.graph.x.domain()
    var rangeSeconds = domain[1] - domain[0]

    units.forEach(function(u) {
      if (Math.floor(rangeSeconds / u.seconds) >= 2) {
        unit = unit || u
      }
    })

    return unit || time.units[time.units.length - 1]
  }

  this.tickOffsets = function() {
    var domain = this.graph.x.domain()

    var unit = this.fixedTimeUnit || this.appropriateTimeUnit()
    var count = Math.ceil((domain[1] - domain[0]) / unit.seconds)

    var runningTick = domain[0]

    var offsets = []

    for (var i = 0; i < count; i++) {
      var tickValue = time.ceil(runningTick, unit)
      runningTick = tickValue + unit.seconds / 2

      offsets.push({ value: tickValue, unit: unit })
    }

    return offsets
  }

  this.render = function() {
    this.elements.forEach(function(e) {
      e.parentNode.removeChild(e)
    })

    this.elements = []

    var offsets = this.tickOffsets()

    offsets.forEach(
      function(o) {
        if (this.graph.x(o.value) > this.graph.x.range()[1]) return

        var element = document.createElement('div')
        element.style.left = this.graph.x(o.value) + 'px'
        element.classList.add('x_tick')
        element.classList.add(this.ticksTreatment)

        var title = document.createElement('div')
        title.classList.add('title')
        title.innerHTML = o.unit.formatter(new Date(o.value * 1000))
        element.appendChild(title)

        this.graph.element.appendChild(element)
        this.elements.push(element)
      }.bind(this)
    )
  }

  this.graph.onUpdate(
    function() {
      this.render()
    }.bind(this)
  )
}
