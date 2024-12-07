const functions = require('firebase-functions');
const fetch = require('node-fetch');
const { defineSecret } = require('firebase-functions/params');

exports.sendImageToGPT = functions.https.onRequest(async (req, res) => {
  try {
    const { base64Image } = req.body;
    if (!base64Image) {
      res.status(400).send('No base64Image provided');
      return;
    }

    // 環境変数からAPIキーを取得
    const apiKeySecret = defineSecret('API_KEY')  || process.env.API_KEY;
    const apiKey = apiKeySecret.value();
    if (!apiKey) {
      console.error('No API key configured');
      res.status(500).send('Server configuration error: No API key');
      return;
    }

    // GPTエンドポイントへPOSTリクエスト
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "g-675450f113388191aa48124ec52898bf-yu-du-gong-imesipan-ding-asisutanto",
            messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: "Hello!" }
            ],
            temperature: 0.7,
            stream: false
        })
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
    res.status(500).send('Internal server error: ' + error.message);
  }
});
