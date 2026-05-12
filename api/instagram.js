export default async function handler(req, res) {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'Token not configured' });
  }

  try {
    const response = await fetch(
      `https://graph.instagram.com/me/media?fields=id,media_type,media_url,permalink,thumbnail_url,timestamp&limit=9&access_token=${token}`
    );
    const data = await response.json();

    // 1時間キャッシュ
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch Instagram media' });
  }
}
