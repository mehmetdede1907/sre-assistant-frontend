import { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

export default function Home() {
  const [metricFile, setMetricFile] = useState(null);
  const [traceFile, setTraceFile] = useState(null);
  const [results, setResults] = useState({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAnalyzing(true);

    const formData = new FormData();
    formData.append('metric_file', metricFile);
    formData.append('trace_file', traceFile);

    try {
      const response = await axios.post('http://localhost:8000/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setResults(response.data.result);
      setIsAnalyzing(false);
    } catch (error) {
      console.error('Error during analysis:', error);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">SRE Analysis Tool</h1>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label className="block mb-2">Metric Data (JSON file):</label>
          <input
            type="file"
            onChange={(e) => setMetricFile(e.target.files[0])}
            accept=".json"
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Trace Data (JSON file):</label>
          <input
            type="file"
            onChange={(e) => setTraceFile(e.target.files[0])}
            accept=".json"
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          disabled={isAnalyzing || !metricFile || !traceFile}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {isAnalyzing ? 'Analyzing...' : 'Start Analysis'}
        </button>
      </form>
      {Object.entries(results).map(([filename, content]) => (
        <div key={filename} className="mb-8">
          <h2 className="text-xl font-semibold mb-2">{filename}</h2>
          {filename.endsWith('.md') ? (
            <ReactMarkdown>{content}</ReactMarkdown>
          ) : (
            <pre className="whitespace-pre-wrap">{content}</pre>
          )}
        </div>
      ))}
    </div>
  );
}