import { Client, Events } from "discord.js";
import deployCommands from "../deploy-commands";
import { initializeVerificationCollector } from "../modules/verificationModule";
import { initializeStickyMessages } from "../modules/stickyMessageModule";
import { checkSupporterStatus } from "../modules/vanityListener";
import { initializeNicknameRequests } from "../modules/NicknameRequestModule";
import { startWebhookListener } from "../githubWebhookListener";

// event handler for making bot online
export default {
  name: Events.ClientReady,
  once: true,
  async execute(client: Client) {
    if (!client.user) {
      console.log(client);
      console.log("client user not found");
      return;
    }

    deployCommands();
    console.log(`Logged in as ${client.user.tag}`);

    const guild = await client.guilds.fetch("1290538848933117993");

    await initializeVerificationCollector(client);
    await initializeStickyMessages();
    await checkSupporterStatus(guild);
    await initializeNicknameRequests(client);
    startWebhookListener(client);

    // Calculate the time difference until the next top of the hour (00 minutes)
    // const now = new Date();
    // const minutesUntilNextHour = 60 - now.getMinutes();
    // const msUntilNextHour =
    //   (minutesUntilNextHour * 60 - now.getSeconds()) * 1000;

    // Schedule the task to run every hour
    setInterval(async () => {
      // Replace with your guild ID
      await checkSupporterStatus(guild);
    }, 5 * 60 * 1000); // 1 hour interval
  },
};
