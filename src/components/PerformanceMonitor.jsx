import React, { useEffect, useState } from 'react';

// Performance monitoring component (only in development)
const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({});

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const updateMetrics = () => {
      const navigation = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');
      
      setMetrics({
        domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart,
        loadComplete: navigation?.loadEventEnd - navigation?.loadEventStart,
        firstPaint: paint.find(p => p.name === 'first-paint')?.startTime,
        firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime,
        memoryUsage: performance.memory ? {
          used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
          total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
          limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
        } : null
      });
    };

    // Update metrics after page load
    setTimeout(updateMetrics, 1000);
    
    // Update metrics every 5 seconds
    const interval = setInterval(updateMetrics, 5000);
    
    return () => clearInterval(interval);
  }, []);

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      fontFamily: 'monospace'
    }}>
      <div><strong>Performance Metrics</strong></div>
      <div>DOM Ready: {metrics.domContentLoaded?.toFixed(2)}ms</div>
      <div>Load Complete: {metrics.loadComplete?.toFixed(2)}ms</div>
      <div>First Paint: {metrics.firstPaint?.toFixed(2)}ms</div>
      <div>FCP: {metrics.firstContentfulPaint?.toFixed(2)}ms</div>
      {metrics.memoryUsage && (
        <div>Memory: {metrics.memoryUsage.used}MB / {metrics.memoryUsage.total}MB</div>
      )}
    </div>
  );
};

export default PerformanceMonitor;
