import * as cheerio from "cheerio";
import TelegramBot from "node-telegram-bot-api";

const TO_CHECK =
  "https://hrmos.co/pages/moneyforward/jobs?category=1862070723159687168";

// for mid career
// https://hrmos.co/pages/moneyforward/jobs?category=1707294702136684546
// for fresh graduate
// https://hrmos.co/pages/moneyforward/jobs?category=1862070723159687168

const checkShouldNotify = async () => {
  const response = await fetch(TO_CHECK);
  const html = await response.text();
  const $ = cheerio.load(html);

  return $(".sg-unavailable-notifier").length === 0;
};

const notify = async () => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const bot = new TelegramBot(token);

  try {
    await bot.sendMessage(chatId, `Check for job listing page: ${TO_CHECK}`);
    console.log("Notification sent successfully");
  } catch (error) {
    console.error("Failed to send notification:", error);
    throw error;
  }
};

(async function main() {
  const shouldNotify = await checkShouldNotify();

  console.log(`Should notify: ${shouldNotify}`);

  if (shouldNotify) {
    await notify();
  }
})().catch(console.error);
