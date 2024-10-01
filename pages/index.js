import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

export default function Home() {
  const [logData, setLogData] = useState('');
  const [metricData, setMetricData] = useState('');
  const [traceData, setTraceData] = useState('');
  const [results, setResults] = useState({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAnalyzing(true);
    try {
      await axios.post('/api/analyze', { log_data: logData, metric_data: metricData, trace_data: traceData });
      checkResults();
    } catch (error) {
      console.error('Error starting analysis:', error);
      setIsAnalyzing(false);
    }
  };

  const checkResults = async () => {
    try {
      const response = await axios.get('/api/results');
      setResults(response.data);
      if (Object.values(response.data).every(value => value !== "File not found")) {
        setIsAnalyzing(false);
      } else {
        setTimeout(checkResults, 5000); // Check again in 5 seconds
      }
    } catch (error) {
      console.error('Error checking results:', error);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">SRE Analysis Tool</h1>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label className="block mb-2">Log Data:</label>
          <textarea
            value={logData}
            onChange={(e) => setLogData(e.target.value)}
            className="w-full p-2 border rounded"
            rows="4"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Metric Data:</label>
          <textarea
            value={metricData}
            onChange={(e) => setMetricData(e.target.value)}
            className="w-full p-2 border rounded"
            rows="4"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Trace Data:</label>
          <textarea
            value={traceData}
            onChange={(e) => setTraceData(e.target.value)}
            className="w-full p-2 border rounded"
            rows="4"
          />
        </div>
        <button
          type="submit"
          disabled={isAnalyzing}
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