import mysql from 'mysql2';
import 'dotenv/config'

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

connection.connect((err) => {
    if (err) {
        console.error("Error al conectar a la base de datos: " + err.message);
    } else {
        console.log("Conexión a la base de datos establecida");
    }
});

export default connection;