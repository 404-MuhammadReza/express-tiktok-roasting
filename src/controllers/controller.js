const model = require('../models/model');
const roastService = require('../services/roastService');
const scraperService = require('../services/scrapperService');

const getRoast = async (req, res) => {
  if (!req.body || !req.body.username) {
    return res.status(400).json({ error: 'Username is required!' });
  }

  try {
    const { username } = req.body;
    const tiktokData = await scraperService.getTiktokData(username);
    const roastTiktok = await roastService.generateRoast(tiktokData);

    const dataToSave = new model({
      username: tiktokData.username,
      nama: tiktokData.name,
      followers: tiktokData.followers,
      following: tiktokData.following,
      like: tiktokData.likeCount,
      video: tiktokData.videoCount,
      roasting: roastTiktok,
    });

    await dataToSave.save();

    res.status(200).json({
      username: tiktokData.username,
      roast: roastTiktok,
    });
  } catch (error) {
    res.status(error.code || 500).json({ error: error.message });
  }
};

const getData = async (req, res) => {
  try {
    const allData = await model.find({});

    if (!allData || allData.length === 0) {
      return res.status(404).json({
        message: 'No Data Found!',
      });
    }

    const formattedData = allData.map((item) => {
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
        timestamp: formattedTimestamp,
      };
    });

    res.status(200).json(formattedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {getRoast, getData};