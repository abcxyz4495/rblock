import mongoose from "mongoose";
import { getErrorMessage } from "@/helper/errorHelper";

type ConnectionObject = {
	isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
	if (connection.isConnected) {
		console.log("Already connected to database");
	}

	try {
		const db = await mongoose.connect(process.env.ATLAS_DB_URL || "", {
			dbName: "rblock-next",
		});
		connection.isConnected = db.connections[0].readyState;

		console.log("Connected to database successfully");
	} catch (error: unknown) {
		console.log("Database connection failed", getErrorMessage(error));

		process.exit(1);
	}
}

export default dbConnect;
