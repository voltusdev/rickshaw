Rickshaw.namespace('Rickshaw.Fixtures.Time.Local')

Rickshaw.Fixtures.Time.Local = function() {
  this.months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]

  this.units = [
    {
      name: 'decade',
      seconds: 86400 * 365.25 * 10,
      formatter: function(d) {
        return parseInt(d.getFullYear() / 10, 10) * 10
      }
    },
    {
      name: 'year',
      seconds: 86400 * 365.25,
      formatter: function(d) {
        return d.getFullYear()
      }
    },
    {
      name: 'month',
      seconds: 86400 * 30.5,
      formatter: function(d) {
        return this.months[d.getMonth()]
      }.bind(this)
    },
    {
      name: 'week',
      seconds: 86400 * 7,
      formatter: function(d) {
        return this.formatDate(d)
      }.bind(this)
    },
    {
      name: 'day',
      seconds: 86400,
      formatter: function(d) {
        return d.getDate()
      }
    },
    {
      name: '6 hour',
      seconds: 3600 * 6,
      formatter: function(d) {
        return this.formatTime(d)
      }.bind(this)
    },
    {
      name: 'hour',
      seconds: 3600,
      formatter: function(d) {
        return this.formatTime(d)
      }.bind(this)
    },
    {
      name: '15 minute',
      seconds: 60 * 15,
      formatter: function(d) {
        return this.formatTime(d)
      }.bind(this)
    },
    {
      name: 'minute',
      seconds: 60,
      formatter: function(d) {
        return d.getMinutes()
      }
    },
    {
      name: '15 second',
      seconds: 15,
      formatter: function(d) {
        return d.getSeconds() + 's'
      }
    },
    {
      name: 'second',
      seconds: 1,
      formatter: function(d) {
        return d.getSeconds() + 's'
      }
    },
    {
      name: 'decisecond',
      seconds: 1 / 10,
      formatter: function(d) {
        return d.getMilliseconds() + 'ms'
      }
    },
    {
      name: 'centisecond',
      seconds: 1 / 100,
      formatter: function(d) {
        return d.getMilliseconds() + 'ms'
      }
    }
  ]

  this.unit = function(unitName) {
    return this.units
      .filter(function(unit) {
        return unitName == unit.name
      })
      .shift()
  }

  this.formatDate = function(d) {
    return d3.timeFormat('%b %e')(d)
  }

  this.formatTime = function(d) {
    return d.toString().match(/(\d+:\d+):/)[1]
  }

  this.ceil = function(time, unit) {
    var date, floor, year, offset

    if (unit.name == 'day') {
      var nearFuture = new Date((time + unit.seconds - 1) * 1000)
      nearFuture.setHours(0, 0, 0, 0)
      return nearFuture.getTime() / 1000
    }

    if (unit.name == 'month') {
      date = new Date(time * 1000)

      floor = new Date(date.getFullYear(), date.getMonth()).getTime() / 1000
      if (floor == time) return time

      year = date.getFullYear()
      var month = date.getMonth() + 1
      return new Date(year, month).getTime() / 1000
    }

    if (unit.name == 'year') {
      date = new Date(time * 1000)

      floor = new Date(date.getUTCFullYear(), 0).getTime() / 1000
      if (floor == time) return time

      year = date.getFullYear() + 1

      return new Date(year, 0).getTime() / 1000
    }
    offset = new Date(time * 1000).getTimezoneOffset() * 60
    return Math.ceil((time - offset) / unit.seconds) * unit.seconds + offset
  }
}
