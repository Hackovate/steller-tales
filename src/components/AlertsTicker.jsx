import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getAlerts, getNotifications } from '../utils/swpcAPI';
import { formatTimeAgo, playNotificationSound } from '../utils/helpers';

const POLL_MS = 30000; // 30s

const levelColor = (msg) => {
  const t = (msg || '').toLowerCase();
  if (t.includes('warning') || t.includes('radio blackout') || t.includes('storm')) return 'text-accent-orange';
  if (t.includes('watch') || t.includes('alert')) return 'text-accent-yellow';
  return 'text-accent-blue';
};

const AlertsTicker = () => {
  const { t } = useLanguage();
  const [items, setItems] = useState([]);
  const lastIdRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        const [alerts, notes] = await Promise.all([getAlerts(), getNotifications()]);
        // SWPC alerts.json/notifications.json are arrays; flatten and map to unified format
        const parse = (arr) => {
          if (!Array.isArray(arr)) return [];
          // If array-of-arrays with header in [0]
          if (Array.isArray(arr[0])) {
            const header = arr[0];
            const rows = arr.slice(1).filter((r) => Array.isArray(r));
            const idxIssued = header.findIndex((h) => String(h).toLowerCase().includes('issue') || String(h).toLowerCase().includes('time'));
            const idxMsg = header.findIndex((h) => String(h).toLowerCase().includes('message') || String(h).toLowerCase().includes('product_text') || String(h).toLowerCase().includes('summary'));
            return rows.map((r, i) => ({
              id: `${r[idxIssued] || ''}-${i}`,
              text: (r[idxMsg] || r[r.length - 1] || '').toString(),
              issued: r[idxIssued] || new Date().toISOString()
            })).filter((x) => x.text);
          }
          // Else array-of-objects
          return arr
            .filter((row) => typeof row === 'object' && row !== null)
            .map((row, i) => ({
              id: row.id || row.messageID || row.serial || `${row?.issued || ''}-${i}`,
              text: row.message || row.body || row.headline || row.summary || 'Space weather update',
              issued: row.issued || row.sent || row.messageIssueTime || row.effective || new Date().toISOString()
            }));
        };
        const all = [...parse(alerts), ...parse(notes)]
          .filter((i) => i.text)
          .sort((a, b) => new Date(b.issued) - new Date(a.issued))
          .slice(0, 20);
        if (!mounted) return;
        // simple new-item detection
        const newestId = all[0]?.id;
        if (newestId && lastIdRef.current && newestId !== lastIdRef.current) {
          playNotificationSound();
        }
        lastIdRef.current = newestId || lastIdRef.current;
        setItems(all);
      } catch (e) {
        // silent fail; keep last items
      }
    };
    fetchData();
    const t = setInterval(fetchData, POLL_MS);
    return () => { mounted = false; clearInterval(t); };
  }, []);

  return (
    <div className="bg-gradient-to-br from-[#16213e]/95 to-[#1a1a2e]/95 rounded-2xl p-4 border border-accent-purple/30 shadow-lg">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">🛰️</span>
        <h3 className="text-lg font-bold text-accent-blue tracking-wide">{t('realTimeAlerts')}</h3>
      </div>
      <div className="overflow-x-auto whitespace-nowrap no-scrollbar py-1">
        {items.length === 0 ? (
          <div className="text-text-light text-sm">{t('noRecentAlerts')}</div>
        ) : (
          items.map((i) => (
            <a key={i.id} href="#" className={`inline-block mr-4 px-3 py-2 rounded-xl bg-space-card/50 border border-accent-purple/20 hover:border-accent-purple/40 transition ${levelColor(i.text)}`} title={new Date(i.issued).toLocaleString()}>
              <span className="font-semibold mr-2">{i.text.replace(/\s+/g, ' ').slice(0, 90)}{i.text.length > 90 ? '…' : ''}</span>
              <span className="text-text-gray text-xs">{formatTimeAgo(i.issued)}</span>
            </a>
          ))
        )}
      </div>
    </div>
  );
};

export default AlertsTicker;


