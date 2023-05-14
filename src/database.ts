import { Pool } from "pg";
require("dotenv").config();

export const pool = new Pool({
    user: process.env.PGUSER || "postgres",
    host: process.env.PGHOST || "localhost",
    database: process.env.PGDATABASE || "myapp",
    password: process.env.PGPASSWORD || "password",
    port: parseInt(process.env.PGPORT || "5432", 10),
});

export const connectToDatabase = async () => {
    try {
        await pool.query("SELECT NOW()");
        console.log("Connected to database");
    } catch (err) {
        console.error("Error connecting to database", err);
    }
};
