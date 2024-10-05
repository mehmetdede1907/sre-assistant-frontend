/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import SREChatbot from '../components/SREChatbot';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [metricFile, setMetricFile] = useState(null);
  const [traceFile, setTraceFile] = useState(null);
  const [results, setResults] = useState({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisContext, setAnalysisContext] = useState(null);
  const [activeTab, setActiveTab] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setAnalysisComplete(false);

    const formData = new FormData();
    formData.append('metric_file', metricFile);
    formData.append('trace_file', traceFile);

    try {
      await axios.post('https://fastapi-app-871836237314.europe-central2.run.app/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      fetchResults();
    } catch (error) {
      console.error('Error during analysis:', error);
      setIsAnalyzing(false);
    }
  };

  const fetchResults = async () => {
    try {
      const response = await axios.get('https://fastapi-app-871836237314.europe-central2.run.app/results');
      setResults(response.data);
      setAnalysisContext(JSON.stringify(response.data));
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      setActiveTab('aggregatedata.json');
    } catch (error) {
      console.error('Error fetching results:', error);
      setIsAnalyzing(false);
    }
  };

  const safeJSONParse = (jsonString) => {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      return jsonString;
    }
  };

  const renderAggregatedData = (data) => {
    if (!data) return null;

    const {
      SystemOverview,
      KeyPerformanceMetrics,
      CriticalErrors,
      PerformanceAnomalies,
      ServiceAnalysis,
      TraceHighlights,
      CorrelatedEvents,
      PotentialRootCauses,
      RecommendedActions,
      QueryTerms,
    } = JSON.parse(data);

    return (
      <div className={styles.aggregatedDataContainer}>
        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>System Overview</h2>
          <p>{SystemOverview}</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>Key Performance Metrics</h2>
          <pre className={styles.jsonContent}>{JSON.stringify(safeJSONParse(KeyPerformanceMetrics), null, 2)}</pre>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>Critical Errors</h2>
          <pre className={styles.jsonContent}>{JSON.stringify(safeJSONParse(CriticalErrors), null, 2)}</pre>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>Performance Anomalies</h2>
          <pre className={styles.jsonContent}>{JSON.stringify(safeJSONParse(PerformanceAnomalies), null, 2)}</pre>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>Service Analysis</h2>
          <pre className={styles.jsonContent}>{JSON.stringify(safeJSONParse(ServiceAnalysis), null, 2)}</pre>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>Trace Highlights</h2>
          <pre className={styles.jsonContent}>{JSON.stringify(safeJSONParse(TraceHighlights), null, 2)}</pre>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>Correlated Events</h2>
          <pre className={styles.jsonContent}>{JSON.stringify(safeJSONParse(CorrelatedEvents), null, 2)}</pre>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>Potential Root Causes</h2>
          <ul>
            {Array.isArray(safeJSONParse(PotentialRootCauses)) ? (
              safeJSONParse(PotentialRootCauses).map((cause, index) => (
                <li key={index}>{cause}</li>
              ))
            ) : (
              <li>{safeJSONParse(PotentialRootCauses)}</li>
            )}
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>Recommended Actions</h2>
          <ul>
            {Array.isArray(safeJSONParse(RecommendedActions)) ? (
              safeJSONParse(RecommendedActions).map((action, index) => (
                <li key={index}>{action}</li>
              ))
            ) : (
              <li>{safeJSONParse(RecommendedActions)}</li>
            )}
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>Query Terms</h2>
          <ul>
            {Array.isArray(safeJSONParse(QueryTerms)) ? (
              safeJSONParse(QueryTerms).map((term, index) => (
                <li key={index}>{term}</li>
              ))
            ) : (
              <li>{safeJSONParse(QueryTerms)}</li>
            )}
          </ul>
        </section>
      </div>
    );
  };

  const renderNonJSONFile = (content) => {
    return <ReactMarkdown>{content}</ReactMarkdown>;
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>SRE Analysis Tool</h1>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Metric Data (JSON file):</label>
          <input
            type="file"
            onChange={(e) => setMetricFile(e.target.files[0])}
            accept=".json"
            className={styles.formInput}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Trace Data (JSON file):</label>
          <input
            type="file"
            onChange={(e) => setTraceFile(e.target.files[0])}
            accept=".json"
            className={styles.formInput}
          />
        </div>
        <button
          type="submit"
          disabled={isAnalyzing || !metricFile || !traceFile}
          className={styles.button}
        >
          {isAnalyzing ? 'Analyzing...' : 'Start Analysis'}
        </button>
      </form>

      {analysisComplete && (
        <>
          <div className={styles.tabs}>
            {Object.keys(results).map((filename) => (
              <button
                key={filename}
                className={`${styles.tabButton} ${activeTab === filename ? styles.active : ''}`}
                onClick={() => setActiveTab(filename)}
              >
                {filename.replace(/\.[^/.]+$/, "")}
              </button>
            ))}
          </div>

          <div className={styles.resultsContainer}>
            {activeTab === 'aggregatedata.json' && renderAggregatedData(results[activeTab])}
            {['metric_analysis.md', 'trace_analysis.md', 'web_search.md'].includes(activeTab) && (
              renderNonJSONFile(results[activeTab])
            )}
          </div>

          <div className={styles.chatSection}>
            <h2 className={styles.resultHeading}>SRE Assistant Chatbot</h2>
            {analysisContext && <SREChatbot analysisContext={analysisContext} />}
          </div>
        </>
      )}
    </div>
  );
}