Rickshaw.namespace('Rickshaw.Graph.Socketio')

Rickshaw.Graph.Socketio = Rickshaw.Class.create(Rickshaw.Graph.Ajax, {
  request: function() {
    io.connect(this.dataURL).on('rickshaw', this.success.bind(this))
  }
})
