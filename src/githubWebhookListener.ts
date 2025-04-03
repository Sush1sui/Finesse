import express, { Request, Response } from "express";
import { Client, TextChannel } from "discord.js";
import { verifyGitHubSignature } from "./Utils.function";

const app = express();

const GITHUB_SECRET = process.env.GITHUB_SECRET;
const EXE_DEV_CHAT = process.env.EXE_DEV_CHAT;

if (!GITHUB_SECRET || !EXE_DEV_CHAT) throw new Error("Missing .env variables");

app.use(express.json({ verify: verifyGitHubSignature }));

export function startWebhookListener(client: Client) {
  app.post("/github-webhook", async (req: Request, res: Response) => {
    const payload = req.body;

    if (payload.ref === "refs/heads/main") {
      const commit = payload.head_commit;
      const commitMessage = commit.message;
      const commitAuthor = commit.author.name;
      const commitUrl = commit.url;

      const discordChannel = client.channels.cache.get(
        EXE_DEV_CHAT!
      ) as TextChannel;
      if (discordChannel) {
        await discordChannel.send(
          `📌 **Hello <@&1292418236108902470>! There is a new commit in Finesse-Tickets Repo**:\n👤 **Author: ${commitAuthor}**\n Commit Message:> ${commitMessage}\n🔗 [View Commit](${commitUrl})`
        );
      } else {
        console.log("Discord channel not found");
      }
    }
    res.status(200).send("Webhook received!");
    return;
  });
}
