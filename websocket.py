import asyncio
import websockets
import serial
import time
import json

arduino_serial = serial.Serial('COM7', 9600, timeout=1)

async def handle_led(websocket, path):
    while True:
        if arduino_serial.inWaiting() > 0:
            distancia = arduino_serial.readline().decode().strip()
            print("Datos recibidos del Arduino:", distancia)
            distance = int(distancia)
            if distance <= 10: 
                mensaje = "Verde"
            elif distance <= 30:
                mensaje = "Amarillo"
            else:
                mensaje = "Rojo"
            await websocket.send(json.dumps({"valor": distance, "mensaje": mensaje}))
        
        try:
            message = await asyncio.wait_for(websocket.recv(), timeout=0.1) # Espera hasta 0.1 segundos para recibir mensajes
            print(f"Recibido del cliente: {message}")
            if message in ["1", "0"]:
                print(f"Enviando a Arduino: {message}")
                arduino_serial.write(message.encode())
        except asyncio.TimeoutError:
            pass  # Ignora si no hay mensajes del cliente
        
async def start_server():
    async with websockets.serve(handle_led, "localhost", 8765):
        await asyncio.Future()  # Ejecuta el servidor indefinidamente

if __name__ == "__main__":
    print("Iniciando servidor WebSocket...")
    asyncio.run(start_server())
