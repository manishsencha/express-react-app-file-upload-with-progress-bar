import express, { Request, Response } from "express";
import cors from 'cors';
const app = express();
import upload from "./middleware/upload";

const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.static('public'));

app.post('/upload', upload.single('file'), (request : Request, response : Response) => {
    console.log(request.file)
    return response.send("File saved successfully")
})

app.listen(PORT, () => {
    console.log(`Server runnung : http://localhost:${PORT}`)
})