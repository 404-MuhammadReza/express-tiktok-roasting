const axios = require("axios");
const { GoogleGenAI } = require("@google/genai");
const model = require('../models/model');

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
            jumlahLike: stats.heartCount,
            jumlahVideo: stats.videoCount,
        };

        console.log('Data TikTok :', tiktokData);
        console.info('Proses API GEMINI!');
        const responseGemini = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            generationConfig: {
                maxOutputTokens: 150
            },
            contents: `Roast habis-habisan akun TikTok ini dengan kata-kata pedas dan sarkastik! Jangan pelit, roasting kreatif!
                        DATA KORBAN:
                        Username: @${tiktokData.username}
                        Nama: ${tiktokData.nama}
                        Followers: ${tiktokData.followers.toLocaleString('id-ID')}
                        Following: ${tiktokData.following.toLocaleString('id-ID')}
                        Total Like: ${tiktokData.jumlahLike.toLocaleString('id-ID')}
                        Jumlah Video: ${tiktokData.jumlahVideo}

                        Analisis semua aspek dari data di atas dan roast dengan detail:
                        - Ratio followers vs following (apakah dia desperate mencari followers?)
                        - Jumlah video vs total like (kontennya bagus atau sampah?)
                        - Segala hal yang bisa dijadikan bahan roasting!

                        Gunakan bahasa Indonesia yang gaul dan tidak perlu basa-basi, langsung pada roasting pedasnya!
                        
                        PENTING: Batasi jawaban hanya 100 kata dalam bentuk teks biasa - jangan gunakan format apa pun seperti bold (tanda bintang), italic, atau lainnya`,
        });

        aiResponseText = responseGemini.text.trim();
        console.info('Berhasil Mendapatkan Roasting');

        console.info('Menyimpan data ke database...');
        const dataToSave = new model({
            username: tiktokData.username,
            nama: tiktokData.nama,
            followers: tiktokData.followers,
            following: tiktokData.following,
            like: tiktokData.jumlahLike,
            video: tiktokData.jumlahVideo,
            roasting: aiResponseText
        });
        
        await dataToSave.save();
        console.info('Data Berhasil Disimpan ke Database');
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

exports.requestData = async (req, res) => {
    try {
        console.info('Mengambil Semua Data dari Database');
        const allData = await model.find({});

        if (!allData || allData.length === 0) {
            console.info('Tidak Ada Data di Database.');
            return res.status(404).json({
                message: "Data Tidak Ada!"
            });
        }

        const formattedData = allData.map(item => {
            const date = new Date(item.timestamp);
            
            const padTo2Digits = (num) => num.toString().padStart(2, '0');

            const day = padTo2Digits(date.getDate());
            const month = padTo2Digits(date.getMonth() + 1);
            const year = date.getFullYear();
            const hours = padTo2Digits(date.getHours());
            const minutes = padTo2Digits(date.getMinutes());

            const formattedTimestamp = `${day}-${month}-${year} ${hours}:${minutes}`;

            return {
                username: item.username,
                nama: item.nama,
                followers: item.followers,
                following: item.following,
                like: item.like,
                video: item.video,
                roasting: item.roasting,
                timestamp: formattedTimestamp
            };
        });

        console.info('Berhasil mengambil dan memformat data.');
        res.status(200).json(formattedData);

    } catch (error) {
        console.error("Gagal mengambil data dari database:", error.message);
        res.status(500).json({
            error: "Terjadi kesalahan pada server saat mengambil data.",
            details: error.message
        });
    }
};