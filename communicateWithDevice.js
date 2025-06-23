let connection = null;
let connectionStartTime = null;
let currentData = [
    {x:0, y:0},    // 0mm position
    {x:0.005, y:0}, // 5mm position
    {x:0.010, y:0}, // 10mm position
    {x:0.015, y:0}, // 15mm position
    {x:0.020, y:0}, // 20mm position
    {x:0.025, y:0}  // 25mm position
];

// Now stores {seconds, slope, heatFlux}
let thermalHistory = []; 

// Now stores {seconds: Number, slope: Number}
let slopeHistory = []; 


function connectDevice() {
    connection = SimpleWebSerial.setupSerialConnection({
        requestElement: "request-access"
    });

    // Record connection time
    connectionStartTime = new Date();
    
    // Set up event listeners that modify currentData directly
    connection.on("s0", dd => currentData[0].y = dd/1024*5*100); // instead of volts suppose 1V is 100oC for now so that we get y as oC
    connection.on("s1", dd => currentData[1].y = dd/1024*5*100+0.3);
    connection.on("s2", dd => currentData[2].y = dd/1024*5*100+0.6);
    connection.on("s3", dd => currentData[3].y = dd/1024*5*100+0.9);
    connection.on("s4", dd => currentData[4].y = dd/1024*5*100+1.2);
    connection.on("s5", dd => currentData[5].y = dd/1024*5*100+1.5); //adding 1.5 degs to create afake gradient
    
    return connection;
}

// Simplified getter - no need to return wrapped object
function getCurrentData() {
    return currentData; // Direct reference is fine since we want live updates
}

function getSlopeHistory() {
    return slopeHistory;
}

function addSlopeToHistory(slope) {
   const secondsElapsed = (new Date() - connectionStartTime) / 1000;
    slopeHistory.push({
        seconds: secondsElapsed,
        slope: slope
    });
    // Keep last N entries if needed
    if (slopeHistory.length > 1000) {
        slopeHistory.shift();
    }

}

function addThermalData(slope, heatFlux) {
    const secondsElapsed = (new Date() - connectionStartTime) / 1000;
    thermalHistory.push({
        seconds: secondsElapsed,
        slope: slope,
        heatFlux: heatFlux
    });
    
    if (thermalHistory.length > 1000) {
        thermalHistory.shift();
    }
}


function getThermalHistory() {
    return thermalHistory;
}


export { connectDevice, getCurrentData, getSlopeHistory, addSlopeToHistory,getThermalHistory ,addThermalData};