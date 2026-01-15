import express, { Application, Request, Response } from 'express';
import cors from "cors";
import dotenv from "dotenv";
// Router
import authorRouter from "./routers/author.router"
import publisherRouter from "./routers/publisher.router"
import branchRouter from "./routers/branch.router"
import staffRouter from "./routers/staff.router"

// Load env
dotenv.config();
const PORT: string = process.env.PORT || "5555";

// Initialize express
const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req: Request, res: Response) => {
    res.status(200).send("Hello world")
});

app.use("/api/v1/authors", authorRouter)
app.use("/api/v1/publishers", publisherRouter)
app.use("/api/v1/branchs", branchRouter)
app.use("/api/v1/staffs", staffRouter)

// Start Server
app.listen(PORT, () => {
    console.log(`API RUNNING at http://localhost:${PORT}`);
});

