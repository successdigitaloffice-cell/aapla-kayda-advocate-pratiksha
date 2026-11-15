import React, { useState } from 'react';
import { CheckCircle2, Video, Calendar, Eye, X } from 'lucide-react';

export default function PublishModal({ isOpen, onClose, reel, onPublishSuccess }) {
  if (!isOpen || !reel) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const [publishedUrl, setPublishedUrl] = useState('');
  const [publishedDate, setPublishedDate] = useState(todayStr);
  const [initialViews, setInitialViews] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!publishedDate) {
      setErrorMsg('कृपया प्रकाशन तारीख प्रविष्ट करा.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch(`/api/reels/${reel.id}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          published_url: publishedUrl.trim(),
          published_date: publishedDate,
          initial_views: parseInt(initialViews, 10) || 0
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'प्रकाशन नोंदवताना त्रुटी आली.');
      }

      onPublishSuccess(data);
      onClose();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Video size={22} color="#D4AF37" />
            <span>Reel प्रकाशित म्हणून चिन्हांकित करा</span>
          </h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.88rem', color: '#CBD5E1', marginBottom: '1.25rem' }}>
          हा Reel प्रकाशित केल्यावर तो कायमस्वरूपी <strong>Published Archive</strong> मध्ये हलवला जाईल आणि भविष्यातील डुप्लिकेट तपासणीसाठी सुरक्षित राहील.
        </p>

        <div style={{ background: 'rgba(212, 175, 55, 0.08)', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(212, 175, 55, 0.2)', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', color: '#D4AF37', fontWeight: 700 }}>विषय (Day {reel.day_number})</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFF', marginTop: '0.2rem' }}>{reel.title}</div>
        </div>

        {errorMsg && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444', color: '#FCA5A5', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.88rem' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} />
              प्रकाशन तारीख (Publish Date) *
            </label>
            <input
              type="date"
              className="form-control"
              value={publishedDate}
              onChange={(e) => setPublishedDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Video size={14} style={{ display: 'inline', marginRight: '4px' }} />
              Instagram Reel URL (ऐच्छिक)
            </label>
            <input
              type="url"
              className="form-control"
              placeholder="https://www.instagram.com/reel/..."
              value={publishedUrl}
              onChange={(e) => setPublishedUrl(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Eye size={14} style={{ display: 'inline', marginRight: '4px' }} />
              सुरुवातीचे व्ह्यूज (Initial Views / Goal)
            </label>
            <input
              type="number"
              className="form-control"
              placeholder="उदा. 5000"
              value={initialViews}
              onChange={(e) => setInitialViews(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-outline">
              रद्द करा
            </button>
            <button type="submit" disabled={isSubmitting} className="btn btn-emerald">
              <CheckCircle2 size={18} />
              <span>{isSubmitting ? 'नोंद होत आहे...' : 'होय, प्रकाशित म्हणून जतन करा'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
