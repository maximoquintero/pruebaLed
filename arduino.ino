#include <Ultrasonic.h>
#define LED_PIN 13
bool ledState = false; // false para apagado, true para encendido
Ultrasonic ultrasonico(11, 12); // Instancia del objeto Ultrasonic con el pin de trigger 11 y el pin de echo 12

void setup() {
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, ledState); // Inicializa el LED en su estado inicial (apagado)
  Serial.begin(9600);
}

void loop() {
  long distancia = ultrasonico.distanceRead(CM);
  if (Serial.available() > 0) {
    String comando = Serial.readStringUntil('\n');
    if (comando == "1") {
      digitalWrite(LED_PIN, HIGH);
      ledState = true;
    } else if (comando == "0") {
      digitalWrite(LED_PIN, LOW);
      ledState = false;
    }
  }

  // Si ledState es verdadero, enviar constantemente la distancia
  if (ledState) {
    Serial.print("1 "); // Indica que el LED está encendido
    Serial.print(distancia); // Envía la distancia medida
    Serial.println(); // Nueva línea para separar datos
  }
  delay(100); // Pequeña pausa para estabilidad
}
