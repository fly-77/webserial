
import { getThermalHistory } from './communicateWithDevice.js';

let thermalSvg, thermalXScale, thermalYScale, fluxLineGenerator;

function initThermalPlot(containerId, width=600, height=200) {

    console.log("initThermalPlot");

    const margin = {top: 20, right: 30, bottom: 50, left: 70};
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    thermalSvg = d3.select(`#${containerId}`)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    
    thermalXScale = d3.scaleLinear().range([0, innerWidth]);
    thermalYScale = d3.scaleLinear().range([innerHeight, 0]);
    
    fluxLineGenerator = d3.line()
        .x(d => thermalXScale(d.seconds))
        .y(d => thermalYScale(d.heatFlux));
    
    // Add axes
    thermalSvg.append("g")
        .attr("class", "thermal-x-axis")
        .attr("transform", `translate(0,${innerHeight})`);
    
    thermalSvg.append("g")
        .attr("class", "thermal-y-axis");
    
    // Add labels
    thermalSvg.append("text")
        .attr("x", innerWidth/2)
        .attr("y", innerHeight + margin.bottom - 10)
        .style("text-anchor", "middle")
        .text("Time (seconds)");
    
    thermalSvg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 10) // Adjusted position (moved further left)
        .attr("x", -innerHeight / 2)
        .style("text-anchor", "middle")
        .style("font-size", "16px")
        .style("fill", "#333") // Darker color for better visibility
        .text("Heat Flux (W/cm²)");
}

function updateThermalPlot() {
    const history = getThermalHistory();

     console.log("getThermalHistory history.length : " + history.length);


    if (history.length === 0) return;
    
    thermalXScale.domain([0, d3.max(history, d => d.seconds)]);
    const fluxExtent = d3.extent(history, d => d.heatFlux);
    thermalYScale.domain([fluxExtent[0] * 1.1, fluxExtent[1] * 1.1]);
    
    // Update axes
    thermalSvg.select(".thermal-x-axis")
        .call(d3.axisBottom(thermalXScale));
    
    thermalSvg.select(".thermal-y-axis")
        .call(d3.axisLeft(thermalYScale)
            .tickFormat(d3.format(".3f"))); // Format to 0 decimal place
    
    // Update heat flux line
    thermalSvg.selectAll(".flux-line")
        .data([history])
        .join("path")
        .attr("class", "flux-line")
        .attr("d", fluxLineGenerator)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 2);
}

export { initThermalPlot, updateThermalPlot };