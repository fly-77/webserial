# ArduinoWebSerial

A webapp to interface with an Arduino board via webSerial API reading analog inputs from inputs A0 ....A5
The app displays the current values read by the arduino board on a plot , interpolates the data , plots the slope versus time on a second plot and on a third plot shows some computed physical property (here heatflux) derived from the measured slope (for example interpreting the "slope" of the interpolated data asa thermal gradient). 

On the arduino side data must be sent using the SimpleWebSerial arduino library 


## Table of Contents
- [Installation](#installation)
- [Usage](#usage)


## Installation
Steps to install your project:
- download the example-arduino-sketch and upload it to any arduino board that has analog inputs A0 to A5. 
- under sketch in the arduino IDE add the SimpleWebSerial arduino library from a zip file.
- get the SimpleWebSerial library zip file from here https://github.com/fmgrafikdesign/simplewebserial-arduino-library
- also install JSON library required by SimpleWebSerial, you can install it from the arduino library manager.
- upload the skecth to any arduino board capable of reading analog inputs A0 ....A5 or any other 5 input values.
- connect the arduino board via USB to the computer
- 
## Usage
- run the webapp on a chrome browser of your computer connected to the arduino board. 
- click on the connect button and choose the USB port of your arduino.





