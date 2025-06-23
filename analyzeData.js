
import { getCurrentData, addSlopeToHistory, addThermalData } from './communicateWithDevice.js';

// Thermal properties of brass
const THERMAL_CONDUCTIVITY = 120; // W/(m·K) for brass
const DISTANCE_BETWEEN_POINTS = 0.005; // 5mm in meters
//const CROSS_SECTIONAL_AREA = 0.003 * 0.003; // 3mm × 3mm in m² (assuming square cross-section)


// Calculate linear regression
function calculateRegression() {
    const data = getCurrentData();
    const n = data.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    
    data.forEach(d => {
        sumX += d.x;
        sumY += d.y;
        sumXY += d.x * d.y;
        sumXX += d.x * d.x;
    });
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Store the slope in history
    addSlopeToHistory(slope);
     console.log("triggered addSlopeToHistory" + slope  );

   
    // Calculate thermal gradient (K/m)
    const thermalGradient = slope ;  // slope is already the thermal gradient since x in data is in meters and y in data is in oC
    
    // Calculate heat flux (W/cm²)
    const heatFlux = -THERMAL_CONDUCTIVITY * thermalGradient/10000;

    addThermalData(slope, heatFlux);
    console.log("triggered addThermalData(slope, heatFlux) " + slope + " , " +heatFlux );
    

    
    return { 
        slope, 
        intercept,
        thermalGradient,
        heatFlux
    };

}

// Generate regression line points
function generateRegressionLine() {
    const data = getCurrentData();
    const { slope, intercept } = calculateRegression();
    const xExtent = d3.extent(data, d => d.x);
    
    return [
        { x: xExtent[0], y: slope * xExtent[0] + intercept },
        { x: xExtent[1], y: slope * xExtent[1] + intercept }
    ];
}

export { calculateRegression, generateRegressionLine };