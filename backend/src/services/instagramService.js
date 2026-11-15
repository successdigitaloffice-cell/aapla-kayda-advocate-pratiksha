import db from '../db/database.js';

export async function getInstagramLiveAnalytics() {
  // Query token and account ID from system_settings or environment
  const tokenRow = db.prepare("SELECT value FROM system_settings WHERE key = 'instagram_access_token'").get();
  const accountRow = db.prepare("SELECT value FROM system_settings WHERE key = 'instagram_account_id'").get();

  const token = tokenRow?.value || process.env.INSTAGRAM_ACCESS_TOKEN;
  const accountId = accountRow?.value || process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;

  if (!token || !accountId) {
    return {
      connected: false,
      status: 'NOT_CONNECTED',
      message: 'Instagram Graph API अद्याप जोडलेली नाही. अचूक आणि अधिकृत आकडेवारीसाठी Settings टॅबमध्ये Access Token व Account ID प्रविष्ट करा.',
      followers: null,
      reach: null,
      views: null,
      impressions: null,
      engagementRate: null,
      lastChecked: new Date().toISOString(),
      note: 'खोटे किंवा अंदाजे फॉलोअर्स दाखवणे सिस्टीम नियमांद्वारे पूर्णपणे बंद केले आहे.'
    };
  }

  try {
    const url = `https://graph.facebook.com/v21.0/${accountId}?fields=name,username,followers_count,follows_count,media_count,profile_picture_url&access_token=${token}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    const data = await res.json();

    if (data.error) {
      return {
        connected: false,
        status: 'AUTH_ERROR',
        message: `Instagram API त्रुटी: ${data.error.message}`,
        error: data.error,
        followers: null
      };
    }

    return {
      connected: true,
      status: 'ACTIVE_LIVE',
      username: data.username || 'aapla_kayda',
      name: data.name || 'Advocate Pratiksha',
      followers: data.followers_count,
      following: data.follows_count,
      mediaCount: data.media_count,
      profilePic: data.profile_picture_url,
      lastChecked: new Date().toISOString()
    };
  } catch (err) {
    return {
      connected: false,
      status: 'NETWORK_ERROR',
      message: `Instagram सर्व्हरशी संपर्क होऊ शकला नाही: ${err.message}`,
      followers: null
    };
  }
}
