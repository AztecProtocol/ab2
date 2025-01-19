import express, { Request, Response } from 'express';
import * as fs from 'fs';
import { PostDkimKeyCheckService } from './post-dkim-key-check-service';

const app = express();
const port = process.env.PORT || 3000;
const filePath = './samples/'

// Middleware to parse JSON bodies
app.use(express.json());

// Define a simple route
app.get('/', async(req: Request, res: Response) => {
  const emailContent = fs.readFileSync(filePath + 'dkimTestEmail.eml'); // Read the EML file
  const postDkimKeyCheckService = new PostDkimKeyCheckService;
  const result = await postDkimKeyCheckService.dkimKeyCheck({emailContent});
  res.send(result);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://127.0.0.1:${port}`);
});
