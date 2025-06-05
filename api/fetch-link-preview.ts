
import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as cheerio from 'cheerio';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;
  
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Valid URL is required' });
  }

  try {
    // Validate URL
    const urlObj = new URL(url);
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return res.status(400).json({ error: 'Invalid URL protocol' });
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LinkPreviewBot/1.0)',
      },
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract Open Graph and Twitter Card metadata
    const metadata = {
      url,
      title: $('meta[property="og:title"]').attr('content') || 
             $('meta[name="twitter:title"]').attr('content') || 
             $('title').text() || 
             url,
      description: $('meta[property="og:description"]').attr('content') || 
                   $('meta[name="twitter:description"]').attr('content') || 
                   $('meta[name="description"]').attr('content') || 
                   '',
      image: $('meta[property="og:image"]').attr('content') || 
             $('meta[name="twitter:image"]').attr('content') || 
             '',
      siteName: $('meta[property="og:site_name"]').attr('content') || 
                urlObj.hostname,
    };

    // Clean up the data
    metadata.title = metadata.title.trim().substring(0, 200);
    metadata.description = metadata.description.trim().substring(0, 300);
    
    // Validate image URL if present
    if (metadata.image && !metadata.image.startsWith('http')) {
      metadata.image = new URL(metadata.image, url).href;
    }

    res.status(200).json(metadata);
  } catch (error) {
    console.error('Error fetching link preview:', error);
    
    // Return basic metadata on error
    const urlObj = new URL(url);
    res.status(200).json({
      url,
      title: urlObj.hostname,
      description: 'Click to view this link',
      siteName: urlObj.hostname,
      image: null,
    });
  }
}
