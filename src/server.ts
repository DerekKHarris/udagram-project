import express from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";

(async () => {
	// Init the Express application
	const app = express();

	// Set the network port
	const port = process.env.PORT || 8082;

	// Use the body parser middleware for post requests
	app.use(bodyParser.json());

	//Retrieves, filters and returns a public image from url
	app.get("/filteredimage", async (req, res) => {
		if (req.query.image_url) {
			filterImageFromURL(req.query.image_url)
				.then((response) => {
					return res.sendFile(response, (err) => {
						if (!err) {
							deleteLocalFiles([response]);
						}
					});
				})
				.catch((error) => {
					return res.status(500).send("Error!");
				});
		} else {
			return res.status(400).send("image_url query parameter required");
		}
	});

	// Root Endpoint
	// Displays a simple message to the user
	app.get("/", async (req, res) => {
		res.send("try GET /filteredimage?image_url={{}}");
	});

	// Start the Server
	app.listen(port, () => {
		console.log(`server running http://localhost:${port}`);
		console.log(`press CTRL+C to stop server`);
	});
})();
