var Rickshaw = require('../rickshaw')

exports.initialize = function(test) {

  var palette = new Rickshaw.Color.Palette();

  test.equal(typeof palette.schemes, 'object');
  test.deepEqual(palette.scheme, [
    '#cb513a',
    '#73c03a',
    '#65b9ac',
    '#4682b4',
    '#96557e',
    '#785f43',
    '#858772',
    '#b5b6a9'
  ]);
  test.equal(palette.runningIndex, 0);
  test.equal(palette.generatorIndex, 0);
  test.equal(palette.rotateCount, 8);
  test.equal(typeof palette.color, 'function');
  test.equal(typeof palette.interpolateColor, 'function');

  test.done();
};

exports.interpolatedStopCount = function(test) {

  var palette = new Rickshaw.Color.Palette({
    interpolatedStopCount: 4
  });

  test.equal(typeof palette.schemes, 'object');
  test.deepEqual(palette.scheme, [
    '#cb513a',
    'rgb(201, 131, 57)',
    'rgb(199, 180, 57)',
    'rgb(165, 196, 57)',
    '#73c03a',
    'rgb(81, 192, 67)',
    'rgb(79, 189, 102)',
    'rgb(90, 187, 141)',
    '#65b9ac',
    'rgb(93, 184, 184)',
    'rgb(85, 169, 183)',
    'rgb(76, 151, 183)',
    '#4682b4',
    'rgb(74, 81, 172)',
    'rgb(114, 78, 165)',
    'rgb(149, 81, 157)',
    '#96557e',
    'rgb(143, 80, 102)',
    'rgb(135, 76, 79)',
    'rgb(128, 85, 71)',
    '#785f43',
    'rgb(125, 109, 78)',
    'rgb(129, 121, 89)',
    'rgb(132, 131, 101)',
    '#858772',
    'rgb(145, 147, 127)',
    'rgb(157, 159, 141)',
    'rgb(169, 170, 155)',
    '#b5b6a9'
  ]);
  test.equal(palette.runningIndex, 0);
  test.equal(palette.generatorIndex, 0);
  test.equal(palette.rotateCount, 29);
  test.equal(typeof palette.color, 'function');
  test.equal(typeof palette.interpolateColor, 'function');

  test.done();
};

exports.interpolateColor = function(test) {

  var palette = new Rickshaw.Color.Palette();

  var color = palette.interpolateColor();
  test.equal(typeof palette.schemes, 'object');
  test.deepEqual(color, palette.scheme[palette.scheme.length - 1]);

  palette.generatorIndex = palette.rotateCount * 2 - 1;
  color = palette.interpolateColor();
  test.equal(typeof palette.schemes, 'object');
  test.deepEqual(color, palette.scheme[palette.scheme.length - 1]);

  palette.scheme = null;
  color = palette.interpolateColor();
  test.equal(color, undefined, 'color is undefined if scheme is not an array');

  test.done();
};
