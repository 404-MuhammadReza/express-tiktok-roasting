const { GoogleGenAI } = require('@google/genai');

const generateRoast = async (tiktokData) => {
  const genAi = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY,
  });

  try {
    const response = await genAi.models.generateContent({
      model: 'gemini-2.5-flash',
      generationConfig: {
        maxOutputTokens: 150,
      },
      contents: `Roast habis-habisan akun TikTok ini dengan kata-kata pedas dan sarkastik! Jangan pelit, roasting kreatif!
        DATA KORBAN:
        Username: @${tiktokData.username}
        Nama: ${tiktokData.name}
        Followers: ${tiktokData.followers}
        Following: ${tiktokData.following}
        Total Like: ${tiktokData.likeCount}
        Jumlah Video: ${tiktokData.videoCount}

        Analisis semua aspek dari data di atas dan roast dengan detail:
        - Ratio followers vs following (apakah dia desperate mencari followers?)
        - Jumlah video vs total like (kontennya bagus atau sampah?)
        - Segala hal yang bisa dijadikan bahan roasting!

        Gunakan bahasa Indonesia yang gaul dan tidak perlu basa-basi, langsung pada roasting pedasnya!
        PENTING: Batasi jawaban hanya 100 kata dalam bentuk teks biasa - jangan gunakan format apa pun seperti bold (tanda bintang), italic, atau lainnya`,
    });

    return response.text.trim();
  } catch (error) {
    const err = new Error('GenAI service is busy, please try again later!');
    err.code = 503;
    throw err;
  }
};

module.exports = {generateRoast};
