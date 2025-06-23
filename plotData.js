import { getCurrentData } from './communicateWithDevice.js';
import { generateRegressionLine,calculateRegression } from './analyzeData.js';

        

let svg, xScale, yScale, lineGenerator, regressionLineGenerator;
let scatterplot, regressionLine, regressionText;

// Initialize plot
function initPlot(containerId, width=600, height=400) {
    const margin = {top: 40, right: 30, bottom: 50, left: 70};
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    // Create SVG
    svg = d3.select(`#${containerId}`)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Initialize scales
    xScale = d3.scaleLinear().range([0, innerWidth]);
    yScale = d3.scaleLinear().range([innerHeight, 0]);
    
    // Initialize line generators
    lineGenerator = d3.line()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y))
        .curve(d3.curveNatural);
    
    regressionLineGenerator = d3.line()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y));
    
    // Add axes
    svg.append("g").attr("class", "x-axis");
    svg.append("g").attr("class", "y-axis");
    
    // Add title
    svg.append("text")
        .attr("x", innerWidth/2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .text("Arduino Sensor Data");

            // Add axis labels
    svg.append("text")
        .attr("x", innerWidth/2)
        .attr("y", innerHeight + margin.bottom - 15)
        .style("text-anchor", "middle")
        .text("position (m)");
    
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 20) // Adjusted position (moved further left)
        .attr("x", -innerHeight / 2)
        .style("text-anchor", "middle")
        .style("font-size", "16px")
        .style("fill", "#333") // Darker color for better visibility
        .text("Temperature (oC)");
    
    // Create plot elements (empty for now)
    scatterplot = svg.append("g").attr("class", "scatterplot");
    regressionLine = svg.append("path").attr("class", "regression-line");
    regressionText = svg.append("text").attr("class", "regression-text");
}

// Update plot with current data
function updatePlot() {
    const data = getCurrentData();
    const regressionData = generateRegressionLine();
    const { slope, intercept } = calculateRegression();
    
    // Update scales
    xScale.domain(d3.extent(data, d => d.x));
    yScale.domain([d3.min(data, d => d.y) * 0.98, d3.max(data, d => d.y) * 1.02]);
    
    // Update axes
    svg.select(".x-axis")
        .attr("transform", `translate(0,${yScale.range()[0]})`)
        .call(d3.axisBottom(xScale));
    
    svg.select(".y-axis")
        .call(d3.axisLeft(yScale));
    
    // Update scatterplot
    scatterplot.selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", d => xScale(d.x))
        .attr("cy", d => yScale(d.y))
        .attr("r", 5)
        .attr("fill", "steelblue");
    
    // Update regression line
    regressionLine
        .datum(regressionData)
        .attr("d", regressionLineGenerator)
        .attr("stroke", "red")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "5,5")
        .attr("fill", "none");
    
    // Update regression text
    regressionText
        .attr("x", xScale.range()[1] - 10)
        .attr("y", 20)
        .attr("text-anchor", "end")
        .text(`y = ${slope.toFixed(5)}x + ${intercept.toFixed(3)}`);
}

export { initPlot, updatePlot };