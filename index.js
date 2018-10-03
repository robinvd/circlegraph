function run() {
  var radius = 400
  var padding = 50
  var center = {x: (radius) + padding, y:(radius) + padding}



  var raw_data = document.getElementById("data").value
  var data
  if (document.getElementById("use_csv").checked) {
    var result = Papa.parse(raw_data, {header: true, dynamicTyping: true})
    if (result.errors > 1) {
        document.getElementById("output").value = result.errors
        return
    }

    console.log(result.data)
    data = result.data
  } else {
    data = JSON.parse(raw_data)
  }
  var style = JSON.parse(document.getElementById("style").value)

  document.getElementById("drawing").innerHTML = ''
  var draw = SVG('drawing').size(radius*2 + padding*2, radius*2 + padding*2)

  var circle = draw.circle(radius*2).center(center.x, center.y).fill(style.circle_style)// .stroke(style.circle_style)
  var points = []

  // already make the polygon so it is in the background
  var polygon = draw.polygon([])

  for (var i=0; i< data.length; i++) {
    var d = data[i]
    var a = Math.PI/data.length*i*2
    var pos = r => [Math.cos(a)*r + center.x, Math.sin(a)*r + center.y]

    draw.line(center.x, center.y, ...pos(radius)).stroke(style.stroke_style)

    var rot = a*180/Math.PI
    if (rot < 180) {
      rot += 180
    }
    draw.plain(d.label).font(style.text_style.font).center(...pos(radius + style.label_offset)).rotate(rot + 90)

    var step_size = (d.scale_end - d.scale_start) / d.steps
    for (var j=1; j<d.steps; j++) {
      var r = radius /d.steps * j
      var num = step_size * j + d.scale_start
      console.log(typeof(num))
      draw.plain((num).toFixed(1)).font(style.text_style.font).center(Math.cos(a)*r + center.x, Math.sin(a)*r + center.y)
    }

    var r = (d.value - d.scale_start) / (d.scale_end - d.scale_start) * radius
    points[i] = pos(r)
  }

  polygon = polygon.center(center.x, center.y).fill(style.area_style.color).opacity(style.area_style.opacity).stroke('none')
  if (style.animate > 0) {
    polygon = polygon.animate(style.animate)
  }
  polygon.plot([].concat(...points))

  document.getElementById("output").value = draw.svg()
}