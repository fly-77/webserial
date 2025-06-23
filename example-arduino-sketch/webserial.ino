#include <SimpleWebSerial.h>
// get the SimpleWebSerial library here https://github.com/fmgrafikdesign/simplewebserial-arduino-library
// add it to your sketch as a zip libray
// also install JSON library required by SimpleWebSerial, you can install it from the arduino library manager.

SimpleWebSerial WebSerial;



void setup() {
  // initialize serial communication at 57600 bits per second: (required 57600 !! )  
  Serial.begin(57600);
  pinMode(A0,INPUT);
  pinMode(A1,INPUT);
  pinMode(A2,INPUT);
  pinMode(A3,INPUT);
  pinMode(A4,INPUT);
  pinMode(A5,INPUT);

}


void loop() {

  WebSerial.send("s0", analogRead(A0));
  WebSerial.send("s1", analogRead(A1));
  WebSerial.send("s2", analogRead(A2));
  WebSerial.send("s3", analogRead(A3));
  WebSerial.send("s4", analogRead(A4));
  WebSerial.send("s5", analogRead(A5));
  delay(500);        // delay in between writes for stability
}