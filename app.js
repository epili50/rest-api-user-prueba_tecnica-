const express = require('express');
const morgan = require('morgan');
const fs = (require('fs'));
const app = express();

// Usamos el middleware morgan para loguear las peticiones del cliente
app.use(morgan('tiny'));

// Middleware para parsear JSON
app.use(express.json()); 

//ruta post
app.post('/post/users', (req, res)=>{
   const { name, surnames } = req.body;

   // Escribimos la información en un fichero. Usamos el método appendFileSync para escribir la información al final del fichero
   const newRow = `${name},${surnames}\n` // 
   fs.appendFileSync("users.txt", newRow);

   res.status(201).json({
    "message": "usser added successfuly",
    "user": req.body
   })
   
});

app.get('/users', (req, res) => {
    const data = fs.readFileSync("users.txt", "utf-8")

      // utilizamos el método split para separar el string por saltos de línea
      const parsedData = data.split('\n');
      parsedData.pop();

      let finalData = parsedData.map(p => {
        const person = p.split(',');

        return {
            name: person[0],
            surnames: person[1]
        }
      });

      const { name, surnames } = req.query
      console.log("🚀 ~ app.get ~ name:", name)

      if(name){
        finalData = finalData.filter(p => p.name == name)
      }

      if(surnames){
        finalData = finalData.filter(p => p.surnames == surnames)
      }

      // devolvemos la respuesta (faltan cosas)
    res.status(200).json({
        "message": "Users retrieved successfully",
        "results": finalData
    })
})

app.listen(3001, (req, res) => {
    console.log("Servidor escuchando correctamente en el puerto " + 3001);
});