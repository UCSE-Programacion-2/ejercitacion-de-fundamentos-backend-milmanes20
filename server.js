const express = require('express');
const fs = require('fs');
const path = require('path');

// Inicializar la aplicación de Express
const app = express();

// Middleware para parsear JSON en el body de las requests (para el POST)
app.use(express.json());

// Servir archivos estáticos desde la carpeta 'public' (frontend)
app.use(express.static('public'));

// TODO: Cargar las variables de entorno utilizando process.loadEnvFile() o configurando el script start/dev con --env-file.
// Hint: Si usas --env-file en el package.json, no hace falta process.loadEnvFile() aquí. Si usas process.loadEnvFile(), hazlo de forma segura (con try/catch).
try {
  // Cargar variables de entorno desde un archivo .env (si existe)
  process.loadEnvFile(path.join(__dirname, '.env'));


} catch (error) {
  // Ignorar error si el archivo .env no existe, ya que puede estar cargado por la terminal
  if (error.code !== 'ENOENT') {
    console.error('Error al cargar variables de entorno:', error);
  }

}

// TODO: Obtener el puerto desde las variables de entorno. Usar 3000 como fallback si no está definido.
const PORT = process.env.PORT || 3000;

// Ruta absoluta al archivo de datos
const dataFilePath = path.join(__dirname, 'data', 'frutas.json');

/**
 * TODO: Implementar un endpoint GET /frutas
 * 1. Debe leer el archivo data/frutas.json utilizando fs.readFileSync o fs.promises.readFile.
 * 2. Debe parsear el contenido a un objeto de JavaScript (JSON.parse).
 * 3. Debe retornar el arreglo de frutas con un status 200.
 */
app.get('/frutas', (req, res) => {
  // Tu código aquí
  try {
    // 1. Leer el archivo frutas.json
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    
    // 2. Parsear el contenido a un objeto JavaScript
    const frutas = JSON.parse(data);
    
    // 3. Retornar el arreglo con status 200
    res.status(200).json(frutas);
  } catch (error) {
    // Es buena práctica manejar errores por si el archivo no se lee correctamente
    res.status(500).json({ error: 'Error al leer el archivo de datos' });
  }
});

/**
 * TODO: Implementar un endpoint GET /frutas/buscar
 * 1. Debe obtener el parámetro de consulta (query) 'nombre' (req.query.nombre).
 * 2. Debe leer el archivo data/frutas.json.
 * 3. Debe filtrar las frutas que contengan el nombre buscado (ignorando mayúsculas/minúsculas).
 * 4. Debe retornar el arreglo filtrado con status 200. Si no hay, retorna un arreglo vacío.
 * IMPORTANTE: ¡Esta ruta debe ir ANTES que la ruta GET /frutas/:id!
 */
app.get('/frutas/buscar', (req, res) => {
  // Tu código aquí
  try {
    // 1. Obtener el parámetro de consulta 'nombre'
    const nombreBuscado = req.query.nombre || '';
    const nombreBuscadoLower = nombreBuscado.toLowerCase();
    
    // 2. Leer el archivo frutas.json
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    const frutas = JSON.parse(data);
    // 3. Filtrar las frutas que contengan el nombre buscado (ignorando mayúsculas/minúsculas)
    const frutasFiltradas = frutas.filter(fruta => fruta.nombre.toLowerCase().includes(nombreBuscadoLower));
    // 4. Retornar el arreglo filtrado con status 200
    res.status(200).json(frutasFiltradas);
  } catch (error) {
    // Manejar errores por si el archivo no se lee correctamente
    res.status(500).json({ error: 'Error al leer el archivo de datos' });
  }
  
});

/**
 * TODO: Implementar un endpoint GET /frutas/:id
 * 1. Debe obtener el id de los parámetros de la url (req.params.id) y convertirlo a número.
 * 2. Debe leer el archivo data/frutas.json.
 * 3. Debe buscar la fruta que coincida con el id.
 * 4. Si la encuentra, retornarla con status 200.
 * 
 * 5. Si no la encuentra, retornar un objeto { error: "Fruta no encontrada" } con status 404.
 */
app.get('/frutas/:id', (req, res) => {
  // Tu código aquí
  try {
    // 1. Obtener el id de los parámetros de la url y convertirlo a número
    const id = parseInt(req.params.id, 10);
    // 2. Leer el archivo frutas.json
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    const frutas = JSON.parse(data);
    // 3. Buscar la fruta que coincida con el id
    const frutaEncontrada = frutas.find(fruta => fruta.id === id);
    // 4. Si la encuentra, retornarla con status 200
    if (frutaEncontrada) {
      res.status(200).json(frutaEncontrada);
    } else {
      // 5. Si no la encuentra, retornar un objeto de error con status 404
      res.status(404).json({ error: "Fruta no encontrada" });
    }
  } catch (error) {
    // Manejar errores por si el archivo no se lee correctamente
    res.status(500).json({ error: 'Error al leer el archivo de datos' });
  }
});

/**
 * TODO: Implementar un endpoint POST /frutas
 * 1. Debe recibir un objeto en el body de la request (req.body) con los datos de la fruta (imagen, nombre, importe, stock).
 * 2. Debe leer el archivo data/frutas.json.
 * 3. Debe crear un nuevo id (el id máximo actual + 1).
 * 4. Debe agregar la nueva fruta al arreglo.
 * 5. Debe escribir el nuevo arreglo en el archivo data/frutas.json utilizando fs.writeFileSync o fs.promises.writeFile.
 * 6. Debe retornar la fruta creada con status 201.
 */
app.post('/frutas', (req, res) => {
  // Tu código aquí
  try {
    // 1. Recibir el objeto en el body de la request
    const nuevaFruta = req.body;
    // 2. Leer el archivo frutas.json
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    const frutas = JSON.parse(data);
    // 3. Crear un nuevo id (el id máximo actual + 1)
    const nuevoId = frutas.length > 0 ? Math.max(...frutas.map(fruta => fruta.id)) + 1 : 1;
    nuevaFruta.id = nuevoId;
    // 4. Agregar la nueva fruta al arreglo
    frutas.push(nuevaFruta);
    // 5. Escribir el nuevo arreglo en el archivo frutas.json
    fs.writeFileSync(dataFilePath, JSON.stringify(frutas, null, 2), 'utf-8');
    // 6. Retornar la fruta creada con status 201
    res.status(201).json(nuevaFruta);
  } catch (error) {
    // Manejar errores por si el archivo no se lee o escribe correctamente
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
  
});

// Iniciar el servidor
// IMPORTANTE: Exportamos el app para poder hacer los tests. No quitar esta condición.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
    console.log(`Abre tu navegador en http://localhost:${PORT} para ver la interfaz web.`);
  });
}

module.exports = app;
