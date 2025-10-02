import React, { useEffect, useState } from 'react';
import { nasaAPI } from '../utils/nasaAPI';

const DEFAULT_TOPICS = ['aurora', 'solar flare', 'magnetosphere', 'coronal mass ejection', 'geomagnetic storm'];

// Fallback images when API fails
const getFallbackImages = (topic) => {
  const fallbackData = {
    'aurora': [
      {
        link: 'https://apod.nasa.gov/apod/image/1901/OrionAlone_Harshaw_960.jpg',
        title: 'Aurora Borealis',
        desc: 'Beautiful Northern Lights dancing in the sky! These colorful lights happen when solar particles meet Earth\'s magnetic field.',
        date: '2024-01-15',
        credit: 'NASA',
        detailsUrl: 'https://apod.nasa.gov/apod/astropix.html'
      },
      {
        link: 'https://apod.nasa.gov/apod/image/1803/AuroraGreenLake_Zhang_960.jpg',
        title: 'Aurora Over Green Lake',
        desc: 'Green aurora lights reflected in a peaceful lake. The green color comes from oxygen atoms in our atmosphere!',
        date: '2024-01-10',
        credit: 'NASA APOD',
        detailsUrl: 'https://apod.nasa.gov/apod/astropix.html'
      }
    ],
    'solar flare': [
      {
        link: 'https://apod.nasa.gov/apod/image/1709/SolarFlare_SDO_960.jpg',
        title: 'Solar Flare from the Sun',
        desc: 'A powerful burst of energy from our Sun! Solar flares are like the Sun sneezing energy into space.',
        date: '2024-01-12',
        credit: 'NASA SDO',
        detailsUrl: 'https://apod.nasa.gov/apod/astropix.html'
      },
      {
        link: 'https://apod.nasa.gov/apod/image/1603/SolarFlare_SDO_960.jpg',
        title: 'X-Class Solar Flare',
        desc: 'The most powerful type of solar flare! These can affect radio signals on Earth.',
        date: '2024-01-08',
        credit: 'NASA SDO',
        detailsUrl: 'https://apod.nasa.gov/apod/astropix.html'
      }
    ],
    'magnetosphere': [
      {
        link: 'https://apod.nasa.gov/apod/image/1503/Magnetosphere_NASA_960.jpg',
        title: 'Earth\'s Magnetic Field',
        desc: 'Our invisible shield! Earth\'s magnetosphere protects us from harmful solar particles.',
        date: '2024-01-14',
        credit: 'NASA',
        detailsUrl: 'https://apod.nasa.gov/apod/astropix.html'
      }
    ],
    'coronal mass ejection': [
      {
        link: 'https://apod.nasa.gov/apod/image/1203/CME_SOHO_960.jpg',
        title: 'Coronal Mass Ejection',
        desc: 'The Sun blowing a giant bubble of particles into space! If it reaches Earth, it can create beautiful auroras.',
        date: '2024-01-11',
        credit: 'NASA SOHO',
        detailsUrl: 'https://apod.nasa.gov/apod/astropix.html'
      }
    ],
    'geomagnetic storm': [
      {
        link: 'https://apod.nasa.gov/apod/image/1503/GeomagneticStorm_NASA_960.jpg',
        title: 'Geomagnetic Storm',
        desc: 'When solar wind disturbs Earth\'s magnetic field, we get geomagnetic storms and amazing auroras!',
        date: '2024-01-13',
        credit: 'NASA',
        detailsUrl: 'https://apod.nasa.gov/apod/astropix.html'
      }
    ]
  };
  
  return fallbackData[topic] || fallbackData['aurora'];
};

const VisualGallery = ({ query = 'aurora', perPage = 8 }) => {
  const [apod, setApod] = useState(null);
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState(query);

  const fetchPage = async (p) => {
    setLoading(true);
    try {
      const [a, lib] = await Promise.all([
        apod ? Promise.resolve(apod) : nasaAPI.getAPOD({ cacheMinutes: 60 }),
        nasaAPI.searchImages({ q: topic, page: p, cacheMinutes: 10 })
      ]);
      setApod(a);
      const items = (lib?.collection?.items || []).slice(0, perPage).map((it) => {
        const link = it.links?.[0]?.href;
        const d = it.data?.[0] || {};
        const title = d.title || 'NASA Image';
        const desc = d.description || '';
        const date = d.date_created ? new Date(d.date_created).toLocaleDateString() : '';
        const credit = d.center || d.photographer || 'NASA';
        const nasaId = d.nasa_id;
        const detailsUrl = nasaId ? `https://images.nasa.gov/details-${encodeURIComponent(nasaId)}` : undefined;
        return { link, title, desc, date, credit, detailsUrl };
      }).filter((x) => x.link);
      setImages(items.length ? items : getFallbackImages(topic));
    } catch (error) {
      setImages(getFallbackImages(topic));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPage(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, topic, perPage]);

  const changeTopic = (t) => {
    setTopic(t);
    setPage(1);
  };

  return (
    <div className="bg-gradient-to-br from-[#16213e]/95 to-[#1a1a2e]/95 rounded-2xl p-4 border border-accent-purple/30 shadow-lg">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">🎬</span>
        <h3 className="text-lg font-bold text-accent-blue tracking-wide">Visual Learning Gallery</h3>
      </div>
      <div className="mb-3 p-3 bg-space-card/50 rounded-xl border border-accent-purple/20">
        <div className="text-sm text-text-light/90">
          Explore short, kid‑friendly visuals about space weather. Tap topics below to see images and clips from NASA’s Images Library. Each card shows a picture, a brief explanation, and a link to learn more.
        </div>
      </div>
      <div className="flex gap-2 flex-wrap mb-3">
        {DEFAULT_TOPICS.map((t) => (
          <button key={t} onClick={() => changeTopic(t)} className={`px-2 py-1 rounded-lg text-xs border ${t===topic?'border-accent-blue text-accent-blue':'border-accent-purple/30 text-text-light'} bg-space-card/50`}>{t}</button>
        ))}
      </div>
      {loading ? (
        <div className="text-text-light text-sm">Loading…</div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3">
            {images.length === 0 && (
              <div className="text-text-gray text-sm">No results. Try another topic.</div>
            )}
            {images.map((im, i) => (
              <div key={i} className="bg-space-card/50 rounded-2xl overflow-hidden border border-accent-purple/20">
                <img src={im.link} alt={im.title} className="w-full h-40 object-cover" />
                <div className="p-3">
                  <div className="text-text-light font-semibold text-sm mb-1">{im.title}</div>
                  {im.desc && <div className="text-xs text-text-light/80 line-clamp-3 mb-1">{im.desc}</div>}
                  <div className="text-[10px] text-text-gray">{im.date}{im.credit?` • ${im.credit}`:''}</div>
                  {im.detailsUrl && (
                    <a href={im.detailsUrl} target="_blank" rel="noreferrer" className="inline-block mt-2 text-xs text-accent-blue">Open on images.nasa.gov →</a>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-3 text-sm">
            <button disabled={page===1} onClick={() => setPage((p) => Math.max(1, p-1))} className={`px-3 py-1 rounded-xl border ${page===1?'border-accent-purple/20 text-text-gray':'border-accent-purple/40 text-text-light'} bg-space-card/50`}>Prev</button>
            <div className="text-text-gray">Page {page}</div>
            <button onClick={() => setPage((p) => p+1)} className="px-3 py-1 rounded-xl border border-accent-purple/40 text-text-light bg-space-card/50">Next</button>
          </div>
          <div className="text-xs text-text-gray mt-2">Assets: NASA APOD, NASA Images Library.</div>
        </>
      )}
    </div>
  );
};

export default VisualGallery;


