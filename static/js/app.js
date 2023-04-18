
function  buildCharts(patientID) {

  d3.json("samples.json").then((data => {
      var samples = data.samples
      var metadata = data.metadata
      var Fmetadata = metadata.filter(d => d.id == patientID)[0]
      var Fsample = samples.filter(d => d.id == patientID)[0]
      var sample_values = Fsample.sample_values
      var otu_ids = Fsample.otu_ids
      var otu_labels = Fsample.otu_labels

      var bar_data = [{
          x: sample_values.slice(0, 10).reverse(),
          y: otu_ids.slice(0, 10).map(otu_id => `OTU ${otu_id}`).reverse(),
          text: otu_labels.slice(0, 10).reverse(),
          type: 'bar',
          orientation: 'h',
          marker: {
              color: 'b'
          },
      }]
      Plotly.newPlot('bar', bar_data)

      var bubble_data = [{
          x: otu_ids,
          y: sample_values,
          text: otu_labels,
          mode: 'markers',
          marker: {
              color: otu_ids,
              size: sample_values,
              colorscale: 'Blues'
          }
      }];
      var layout = {
          xaxis: { title: "OTU IDs" },
      };
      Plotly.newPlot('bubble', bubble_data, layout)


      var wfreq = Fmetadata.wfreq
      var gaugedata = [
          {
              domain: { x: [0, 1], y: [0, 1] },
              value: wfreq,
              title: { text: "Belly Button Washing Frequency" },
              type: "indicator",
              mode: "gauge+number",
              gauge: {
                  bar: {color: 'black'},
                  axis: { range: [null, 9] },
                  steps: [
                      { range: [0, 2], color: 'rgb(218,247,254)' },
                      { range: [2, 4], color: 'rgb(110,221,251)' },
                      { range: [4, 6], color: 'rgb(7,198,250)' },
                      { range: [6, 8], color: 'rgb(18,117,250)' },
                      { range: [8,9], color: 'rgb(3,84,191)' },
                  ],
              }
          }
      ];
      var gaugelayout = { width: 500, height: 400, margin: { t: 0, b: 0 } };
      Plotly.newPlot('gauge', gaugedata, gaugelayout);
  }))


};

function DemoInfo(patientID) {
  d3.select("#sample-metadata").selectAll("p").remove();
  var demographicInfoBox = d3.select("#sample-metadata");
  d3.json("samples.json").then(data => {
    var metadata = data.metadata
    var Fmetadata = metadata.filter(d => d.id == patientID)[0]
    Object.entries(Fmetadata).forEach(([key, value]) => {
          demographicInfoBox.append("p").text(`${key}: ${value}`)
      })


  })
}

function optionChanged(patientID) {
  console.log(patientID);
  buildCharts(patientID);
  DemoInfo(patientID);
  
}

function initDashboard() {
  var dropdown = d3.select("#selDataset")
  d3.json("samples.json").then(data => {
      var patientIDs = data.names;
      patientIDs.forEach(patientID => {
          dropdown.append("option").text(patientID).property("value", patientID)
      })
      buildCharts(patientIDs[0]);
      DemoInfo(patientIDs[0]);
  });
};

initDashboard();

