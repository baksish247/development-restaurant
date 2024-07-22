import QRCode from 'qrcode';

export default async function handler(req, res) {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const qrCodeDataURL = await QRCode.toDataURL(url);
    res.status(200).json({ qrCodeDataURL });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
}