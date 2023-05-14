import { Router, Request, Response } from "express";
import { pool } from "../database";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
    const { clientId } = req.body;

    // Check if client ID is valid
    const clientResult = await pool.query(
        "SELECT * FROM tblclients WHERE clientId = $1",
        [clientId]
    );
    if (clientResult.rows.length === 0) {
        res.status(400).send("Invalid client ID");
        return;
    }

    // Check if API key already exists for this client
    const apiKeyResult = await pool.query(
        "SELECT * FROM tblclienttokens WHERE clientId = $1",
        [clientId]
    );
    if (apiKeyResult.rows.length > 0) {
        res.status(409).send("API key already exists for this client");
        return;
    }

    // Generate API key
    const apiKey =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
    const createdDate = new Date().toISOString();

    // Insert API key into database
    const insertResult = await pool.query(
        "INSERT INTO tblclienttokens (clientId, apiKey, createdDate) VALUES ($1, $2, $3) RETURNING apiKey",
        [clientId, apiKey, createdDate]
    );

    // Return the created API key
    res.json({ apiKey: insertResult.rows[0].apiKey });
});

export default router;
