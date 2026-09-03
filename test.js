// Este test lanza un error a propósito para fallar la pipeline.
// Para hacer que pase el test, corrige el error o cambia la condición a true.

function testErrorEstupido() {
  const todoOk = false; // Cambiar a true cuando quieras que el test pase

  if (!todoOk) {
    throw new Error("Error estupido: El test ha fallado intencionadamente.");
  }

  console.log("Todo OK: El test ha pasado correctamente.");
}

testErrorEstupido();
