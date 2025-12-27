const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const getTiktokData = async (user) => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.goto(`https://www.tiktok.com/@${user}`, { waitUntil: 'networkidle2' });

    const tiktokData = await page.evaluate(() => {
      if (!document.querySelector('[data-e2e="user-title"]')) {
        throw new Error('NOT_FOUND');
      }

      const getText = (sel) => document.querySelector(sel)?.textContent || null;
      const getNum = (sel) => Number(document.querySelector(sel)?.textContent.replaceAll(/[.]/g, '').replaceAll(/[k, K]/g, '000').replaceAll(/[m, M]/g, '000000')) || null;
      const getLength = (sel) => document.querySelectorAll(sel)?.length || null;

      return {
        username: getText('[data-e2e="user-title"]'),
        name: getText('[data-e2e="user-subtitle"]'),
        following: getNum('[data-e2e="following-count"]'),
        followers: getNum('[data-e2e="followers-count"]'),
        likeCount: getNum('[data-e2e="likes-count"]'),
        videoCount: getLength('[data-e2e="user-post-item"]'),
      };
    });
    return tiktokData;
  } catch (error) {
    if (error.message === 'NOT_FOUND') {
      const err = new Error('TikTok account does not exist');
      err.code = 404;
      throw err;
    }

    const err = new Error('TikTok scrapper service is busy, please try again later!');
    err.code = 503;
    throw err;
  } finally {
    if(browser) await browser.close();
  }
};

module.exports = { getTiktokData };
