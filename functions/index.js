const functions = require('firebase-functions');
const fetch = require('node-fetch');

exports.sendImageToGPT = functions.https.onRequest(async (req, res) => {
  try {
    const { base64Image } = req.body;
    if (!base64Image) {
      res.status(400).send('No base64Image provided');
      return;
    }

    // 環境変数からAPIキーを取得
    const apiKey = functions.config().gpt?.key || process.env.API_KEY;
    if (!apiKey) {
      console.error('No API key configured');
      res.status(500).send('Server configuration error: No API key');
      return;
    }

    // GPTエンドポイントへPOSTリクエスト
    const response = await fetch('https://chatgpt.com/g/g-675450f113388191aa48124ec52898bf-yu-du-gong-imesipan-ding-asisutanto', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}` // APIキーをヘッダーとして付与
      },
      body: JSON.stringify({ image: base64Image })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error from GPT endpoint:', errorText);
      res.status(500).send('Error from GPT endpoint: ' + errorText);
      return;
    }

    const data = await response.json();
    res.status(200).send(data);

  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).send('Internal server error');
  }
});
