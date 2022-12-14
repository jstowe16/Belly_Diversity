function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
  
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    
    var test = result.wfreq;

    console.log(test);
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // console.log(data);
  
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // console.log(samples)

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredSample = samples.filter(sampleObj => sampleObj.id == sample);
    // console.log(sample);
    // console.log(filteredSample);

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
     
    var test = result.wfreq;

    // Create a variable that holds the first sample in the array.
  

    // 2. Create a variable that holds the first sample in the metadata array.
    

    // Create variables that hold the otu_ids, otu_labels, and sample_values.


    // 3. Create a variable that holds the washing frequency.
   
    // Create the yticks for the bar chart.


    //  5. Create a variable that holds the first sample in the array.
    var firstSample = filteredSample[0];
    
    // // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuId = Object.values(firstSample.otu_ids);
    var otuLabels = Object.values(firstSample.otu_labels);
    var sampleValues = Object.values(firstSample.sample_values);

    // console.log(otuId)
    // console.log(otuLabels)
    // console.log(sampleValues)
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    console.log(firstSample)

    var yticks = otuId.slice(0,10).map(val => "OTU " + String(val)).reverse();
    otuLabels = otuLabels.slice(0,10).reverse();
    sampleValues = sampleValues.slice(0,10).reverse();
    
    // yticks = yticks.reverse();
    // var yticks = otuId.slice(0,10).reverse()// .map(id => id.id).reverse
    console.log(yticks)
    console.log(otuLabels)
    console.log(sampleValues)
    
    // 8. Create the trace for the bar chart. 
    var barData = {
      x: sampleValues,
      y: yticks,
      type: "bar",
      text: otuLabels,
      orientation: "h"
    };
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: {title: "Count"},
      yaxis: {title: "OTU ID"}
      };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", [barData], barLayout)

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuId,
      y: sampleValues,
      text: otuLabels,
      type: "bubble",
      mode: "markers",
      marker: {
        color: otuId,
        colorscale: otuLabels, // otu_labels,
        size: sampleValues//sample_values
      }

    }];
  
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      hovermode: "closest"
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData,bubbleLayout);

    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      // domain:{ x: [0, 1], y: [0, 1] },
      
      type: "indicator",
      mode: "gauge+number",
      value: test,
      title: {text: "Scrubs per Week"},
      gauge: {
        axis: { range: [0, 10], tickwidth: 1, tickcolor: "darkblue" },
        bar: { color: "black" },
        bgcolor: "gray",
        borderwidth: 2,
        bordercolor: "gray",
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "lightgreen" },
          { range: [8, 10], color: "green" }
          
        ],
        threshold: {
          line: { color: "red", width: 4 },
          thickness: 0.75,
          value: 490
        }
      }
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
     // title: "Belly Button Washing Frequency"
     
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge",gaugeData, gaugeLayout);

  });
}

// Assign the variable created in Step 3 to the value property.
// The type property should be "indicator".
// The mode property should be "gauge+number".
// For the title object, assign the title as a string using HTML syntax to the text property.
// For maximum range for the gauge should be 10.
// Set the bar color of the gauge to black or a dark color to contrast against the range colors.
// Assign different colors as string values in increments of 2 for the steps object. The colors can be named colors as in the Matplotlib colorsLinks to an external site. or rgba values.
