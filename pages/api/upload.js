import axios from 'axios';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(500).json({ error: 'Error parsing form data' });
        return;
      }

      const formData = new FormData();
      formData.append('metric_file', fs.createReadStream(files.metric_file.filepath), files.metric_file.originalFilename);
      formData.append('trace_file', fs.createReadStream(files.trace_file.filepath), files.trace_file.originalFilename);

      try {
        const response = await axios.post('http://localhost:8000/upload', formData, {
          headers: {
            ...formData.getHeaders(),
          },
        });
        res.status(200).json(response.data);
      } catch (error) {
        res.status(500).json({ error: 'Error communicating with backend' });
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}