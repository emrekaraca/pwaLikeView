import * as d3 from './../../node_modules/c3/node_modules/d3'

export default function () {
  var $Selector,
    $Data,
    $Label,
    $CellSize,
    $CellGap,
    $Rows,
    $Columns,
    $Rounded,
    $Keys,
    $UseWidth

  var defaults = {
    size: 6,
    rows: 50,
    columns: 100,
    rounded: false,
    gap: 2
  }

  function generatedWaffleChart () {
    $Keys = d3.keys($Data[0])

    var obj = {
      selector: $Selector,
      data: $Data,
      label: $Label,
      size: $CellSize,
      gap: $CellGap,
      rows: $Rows,
      columns: $Columns,
      rounded: $Rounded
    }

    drawWaffleChart(obj)
  }

  function drawWaffleChart (_obj) {
    if (!_obj.size) { _obj.size = defaults.size }
    if (!_obj.rows) { _obj.rows = defaults.rows }
    if (!_obj.columns) { _obj.columns = defaults.columns }
    if (_obj.gap === undefined) { _obj.gap = defaults.gap }
    if (_obj.rounded === undefined) { _obj.columns = defaults.rounded }

    var formattedData = []
    var domain = []
    var value = $Keys[$Keys.length - 1]
    var total = d3.sum(_obj.data, function (d) { return d[value] })

    if ($UseWidth) {
      var forcedWidth = d3.select(_obj.selector).node().getBoundingClientRect().width
      _obj.columns = Math.floor(forcedWidth / (_obj.size + _obj.gap))
    }

    var squareVal = total / (_obj.rows * _obj.columns)

    _obj.data.forEach(function (d, i) {
      d[value] = +d[value]
      d.units = Math.floor(d[value] / squareVal)
      Array(d.units + 1).join(1).split('').map(function () {
        formattedData.push({
          squareVal: squareVal,
          units: d.units,
          value: d[value],
          groupIndex: i
        })
      })
      domain.push(d[$Keys[0]])
    })

    var red = '#CE2A23'

    var color = d3.scale.linear()
      .domain([1, _obj.data.length - 1])
      .interpolate(d3.interpolateRgb)
      .range(['#555', '#EEE'])

    // add label

    if (_obj.label) {
      d3.select(_obj.selector)
        .append('div')
        .attr('class', 'label')
        .text(_obj.label)
    }

    // add legend

    var legend = d3.select($Selector)
      .append('div')
      .attr('class', 'legend')

    var legendItem = legend.selectAll('div')
      .data(_obj.data)

    legendItem.enter()
      .append('div')
      .attr('class', function (d, i) {
        return 'legend_item legend_item_' + (i + 1)
      })

    var legendIcon = legendItem.append('div')
      .attr('class', function (d) { return 'legend_item_icon rect-' + d[$Keys[0]] })
      .style('background-color', function (d, i) {
        if (i === 0) {
          return red
        } else {
          return color(i)
        }
      })

    if (_obj.rounded) {
      legendIcon.style('border-radius', '50%')
    }

    legendItem.append('span')
      .attr('class', 'legend_item_text')
      .text(function (d) { return d[$Keys[0]] })

    // set up the dimensions

    var width = (_obj.size * _obj.columns) + (_obj.columns * _obj.gap) - _obj.gap
    var height = (_obj.size * _obj.rows) + (_obj.rows * _obj.gap) - _obj.gap

    if ($UseWidth) {
      width = d3.select(_obj.selector).node().getBoundingClientRect().width
    }

    var svg = d3.select(_obj.selector)
      .append('svg')
      .attr('class', 'waffle')
      .attr('width', width)
      .attr('height', height)

    var g = svg.append('g')
      .attr('transform', 'translate(0,0)')

    // insert dem items

    var item = g.selectAll('.unit')
      .data(formattedData)

    item.enter()
      .append('rect')
      .attr('class', 'unit')
      .attr('class', function (d, i) {
        return 'rect-' + _obj.data[d.groupIndex][$Keys[0]]
      })
      .attr('width', _obj.size)
      .attr('height', _obj.size)
      .attr('fill', function (d) {
        if (d.groupIndex === 0) {
          return red
        } else {
          return color(d.groupIndex)
        }
      })
      .attr('x', function (d, i) {
        var col = Math.floor(i / _obj.rows)
        return (col * (_obj.size)) + (col * _obj.gap)
      })
      .attr('y', function (d, i) {
        var row = i % _obj.rows
        return (_obj.rows * (_obj.size + _obj.gap)) - ((row * _obj.size) + (row * _obj.gap)) - _obj.size - _obj.gap
      })
      .append('title')
      .text(function (d, i) {
        return _obj.data[d.groupIndex][$Keys[0]] + ': ' + Math.round((d.units / formattedData.length) * 100) + '%'
      })

    if (_obj.rounded) {
      item
        .attr('rx', (_obj.size / 2))
        .attr('ry', (_obj.size / 2))
    }
  }

  generatedWaffleChart.selector = function (value) {
    if (!arguments.length) { return $Selector }
    $Selector = value
    return generatedWaffleChart
  }

  generatedWaffleChart.data = function (value) {
    if (!arguments.length) { return $Data }
    $Data = value
    return generatedWaffleChart
  }

  generatedWaffleChart.useWidth = function (value) {
    if (!arguments.length) { return $UseWidth }
    $UseWidth = value
    return generatedWaffleChart
  }

  generatedWaffleChart.label = function (value) {
    if (!arguments.length) { return $Label }
    $Label = value
    return generatedWaffleChart
  }

  generatedWaffleChart.size = function (value) {
    if (!arguments.length) { return $CellSize }
    $CellSize = value
    return generatedWaffleChart
  }

  generatedWaffleChart.gap = function (value) {
    if (!arguments.length) { return $CellGap }
    $CellGap = value
    return generatedWaffleChart
  }

  generatedWaffleChart.rows = function (value) {
    if (!arguments.length) { return $Rows }
    $Rows = value
    return generatedWaffleChart
  }

  generatedWaffleChart.columns = function (value) {
    if (!arguments.length) { return $Columns }
    $Columns = value
    return generatedWaffleChart
  }

  generatedWaffleChart.rounded = function (value) {
    if (!arguments.length) { return $Rounded }
    $Rounded = value
    return generatedWaffleChart
  }

  return generatedWaffleChart
}
