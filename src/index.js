import randomColor from 'randomcolor'

window.onload = function() {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  const audioElement = document.getElementById('song')
  const audioSrc = audioCtx.createMediaElementSource(audioElement)
  const analyser = audioCtx.createAnalyser()

  // Bind our analyser to the media element source.
  audioSrc.connect(analyser)
  audioSrc.connect(audioCtx.destination)

  const frequencyData = new Uint8Array(200)
  const svgHeight = window.innerHeight * 0.7
  const svgWidth = window.innerWidth
  const barPadding = '1'

  const svg = d3
    .select('body')
    .append('svg')
    .attr('class', 'viz')
    .attr('height', svgHeight)
    .attr('width', svgWidth)

  // Create our initial D3 chart.
  svg
    .selectAll('rect')
    .data(frequencyData)
    .enter()
    .append('rect')
    .attr('x', (d, i) => i * (svgWidth / frequencyData.length))
    .attr('width', svgWidth / frequencyData.length - barPadding)

  // Continuously loop and update chart with frequency data.
  const renderChart = () => {
    requestAnimationFrame(renderChart)

    // Copy frequency data to frequencyData array.
    analyser.getByteFrequencyData(frequencyData)

    // Update d3 chart with new data.
    svg
      .selectAll('rect')
      .data(frequencyData)
      .attr('y', d => svgHeight - d)
      .attr('height', d => d)
      .attr('fill', d => randomColor({ hue: 'purple' }))
  }

  renderChart()
}
