import { getSlopeHistory } from './communicateWithDevice.js';

let slopeSvg, slopeXScale, slopeYScale, slopeLineGenerator;

function initSlopePlot(containerId, width=600, height=200) {
    const margin = {top: 20, right: 30, bottom: 50, left: 70};
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;


    console.log("initSlopePlot called");
    
    slopeSvg = d3.select(`#${containerId}`)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Now uses scaleLinear for seconds
    slopeXScale = d3.scaleLinear().range([0, innerWidth]);
    slopeYScale = d3.scaleLinear().range([innerHeight, 0]);
    
    slopeLineGenerator = d3.line()
        .x(d => slopeXScale(d.seconds))
        .y(d => slopeYScale(d.slope/100)); // divide by 100  to represent it as oC/cm instead of oC/m 
    
    // Add axes
    slopeSvg.append("g")
        .attr("class", "slope-x-axis")
        .attr("transform", `translate(0,${innerHeight})`);
    
    slopeSvg.append("g")
        .attr("class", "slope-y-axis");
    
    // Add axis labels
    slopeSvg.append("text")
        .attr("x", innerWidth/2)
        .attr("y", innerHeight + margin.bottom - 15)
        .style("text-anchor", "middle")
        .text("Time (seconds)");
    
    slopeSvg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 20) // Adjusted position (moved further left)
        .attr("x", -innerHeight / 2)
        .style("text-anchor", "middle")
        .style("font-size", "16px")
        .style("fill", "#333") // Darker color for better visibility
        .text("Thermal gradient (oC/cm)");


}

function updateSlopePlot() {

     console.log("updateSlopePlot called");

    const history = getSlopeHistory();

    console.log("updateSlopePlot history.length : " + history.length);
    if (history.length === 0) return;
    
    // Update scales
    slopeXScale.domain([0, d3.max(history, d => d.seconds)]);
    slopeYScale.domain([d3.min(history, d => d.slope/100) * 0.9,   // divide by 100  to represent it as oC/cm instead of oC/m 
                       d3.max(history, d => d.slope/100) * 1.1]);  // divide by 100  to represent it as oC/cm instead of oC/m 
    
    // Update axes
    slopeSvg.select(".slope-x-axis")
        .call(d3.axisBottom(slopeXScale));
    
    slopeSvg.select(".slope-y-axis")
        .call(d3.axisLeft(slopeYScale));
    
    // Update line
    slopeSvg.selectAll(".slope-line")
        .data([history])
        .join("path")
        .attr("class", "slope-line")
        .attr("d", slopeLineGenerator)
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-width", 2);
}

export { initSlopePlot, updateSlopePlot };