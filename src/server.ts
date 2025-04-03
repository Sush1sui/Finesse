import express, { Request, Response } from "express";
import "dotenv/config";
import fetch from "node-fetch";
import { client } from "./app";
import { TextChannel } from "discord.js";

const app = express();
const GITHUB_SECRET = process.env.GITHUB_SECRET;
const EXE_DEV_CHAT = process.env.EXE_DEV_CHAT;

if (!GITHUB_SECRET || !EXE_DEV_CHAT) throw new Error("Missing .env variables");

const PORT = process.env.PORT || 6969;

const BOT = process.env.BOT;
let timeoutId: NodeJS.Timeout;

app.use(express.json({ verify: verifyGitHubSignature }));

function pingBot() {
  if (!BOT) return; // Prevent overlap if already pinging

  const attemptPing = () => {
    fetch(BOT)
      .then((res) => res.text())
      .then((text) => {
        console.log("Ping successful:", text);
      })
      .catch((err) => {
        clearTimeout(timeoutId);
        console.error("Ping failed, retrying:", err);
        timeoutId = setTimeout(attemptPing, 5000); // Retry after 5 seconds
      });
  };

  attemptPing(); // Start the initial ping
}

export function startServer() {
  app.get("/", (_req, res) => res.send("Bot is running"));
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

  setInterval(pingBot, 600000); // Ping every 10 minutes

  app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

  // Graceful shutdown
  process.on("SIGINT", () => {
    console.log("Server shutting down gracefully");
    process.exit(0);
  });
}
function verifyGitHubSignature(
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
  buf: Buffer,
  encoding: string
): void {
  throw new Error("Function not implemented.");
}
