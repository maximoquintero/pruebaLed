const express = require("express");
const cors = require("cors");
const { json } = require("express");
const connection = require("./database");

const app = express();
app.use(express.json());
app.use(cors());

app.put("/led/:id", function cambiarEstado(request, response) {
  const estado = request.body.estado;
  const id = request.params.id;

  connection.query(
    `UPDATE estado_led
     SET led_status = ?
     WHERE id_estado_led = ?`,
    [estado, id],
    (error, results) => {
      if (error) {
        console.error("Error al actualizar el estado:", error);
        response.status(500).json({ error: "Error" });
      } else {
        console.log("Estado actualizado:", results);
        response.status(200).json(results);
      }
    }
  );
});

app.get("/led/:id", function cambiarEstado(request, response) {
  const id = request.params.id;

  connection.query(
    `SELECT * FROM estado_led
      WHERE id_estado_led = ?`,
    [id],
    (error, results) => {
      if (error) {
        console.error("Error al mostrar el estado:", error);
        response.status(500).json({ error: "Error" });
      } else {
        console.log("Operación exitosa:", results);
        response.status(200).json(results);
      }
    }
  );
});

app.listen(8082, () => {
  console.log("servidor iniciando...");
});
