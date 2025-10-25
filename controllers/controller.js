const axios = require("axios");
const { GoogleGenAI } = require("@google/genai");

exports.requestRoast = async (req, res) => {
    const ai = new GoogleGenAI({
        apiKey: process.env.GOOGLE_API_KEY,
    });
    let aiResponseText = "";
    let { username } = req.body;

    if (!username) {
        return res.status(400).json({
            error: "Username wajib diisi!",
        });
    }

    const tiktokScraper = {
        method: "GET",
        url: "https://tiktok-scraper29.p.rapidapi.com/user/details_unique_id",
        params: {
            unique_id: username,
        },
        headers: {
            "x-rapidapi-key": process.env.RAPIDAPI_KEY,
            "x-rapidapi-host": "tiktok-scraper29.p.rapidapi.com",
        },
    };

    try {
        console.info('Proses Scrapper TikTok!')
        const responseTiktok = await axios.request(tiktokScraper);

        if (!responseTiktok.data || !responseTiktok.data.userInfo) {
            return res.status(404).json({
                error: "User tidak ditemukan atau data tidak valid",
            });
        }

        console.info('Scraper TikTok Berhasil!')

        const userInfo = responseTiktok.data.userInfo;
        const stats = userInfo.stats;
        const user = userInfo.user;

        const tiktokData = {
            username: user.uniqueId,
            nama: user.nickname,
            followers: stats.followerCount,
            following: stats.followingCount,
            teman: stats.friendCount,
            jumlahLike: stats.heartCount,
            jumlahVideo: stats.videoCount,
        };

        console.log('Data TikTok :', tiktokData);
        console.info('Proses API GEMINI!');
        const responseGemini = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Roast habis-habisan akun TikTok ini dengan gaya yang lucu, sarkastik, dan savage tapi tetap kreatif! Jangan pelit, roasting harus pedas dan menghibur!
                        DATA KORBAN:
                        👤 Username: @${tiktokData.username}
                        📝 Nama: ${tiktokData.nama}
                        👥 Followers: ${tiktokData.followers.toLocaleString('id-ID')}
                        ➕ Following: ${tiktokData.following.toLocaleString('id-ID')}
                        👫 Teman: ${tiktokData.teman}
                        ❤️ Total Like: ${tiktokData.jumlahLike.toLocaleString('id-ID')}
                        🎬 Jumlah Video: ${tiktokData.jumlahVideo}

                        Analisis semua aspek dari data di atas dan roast dengan detail:
                        - Ratio followers vs following (apakah dia desperate mencari followers?)
                        - Jumlah video vs total like (kontennya bagus atau sampah?)
                        - Jumlah teman vs followers (antisosial atau sombong?)
                        - Segala hal yang bisa dijadikan bahan roasting!

                        Gunakan bahasa Indonesia yang gaul, santai, dan savage. Panjang roasting minimal 80 kata! GO WILD! 🔥`,
        });

        aiResponseText = responseGemini.text.trim();
        console.info('Berhasil Mendapatkan Roasting');
    } catch (error) {
        console.error("Gagal memanggil :", error.message);

        return res.status(500).json({
            error: "Gagal memproses permintaan. Layanan tidak tersedia.",
            details: error.message,
        });
    }

    res.status(201).json({
        message: "Pengguna berhasil diproses dan di-roast!",
        username: username,
        roast: aiResponseText,
    });
};
