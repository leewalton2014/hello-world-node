import { Request, Response, NextFunction } from "express";
import { pool } from "../database";

export const protectApiEndpoint = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const secret = req.headers.authorization;

    if (!secret) {
        res.status(401).send("Authorization header is required");
        return;
    }

    const result = await pool.query(
        "SELECT * FROM tblapisecrets WHERE secret = $1",
        [secret]
    );

    if (result.rows.length === 0) {
        res.status(401).send("Invalid API key");
        return;
    }

    next();
};
