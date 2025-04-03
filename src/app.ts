import {
  ActivityType,
  Client,
  Collection,
  GatewayIntentBits,
} from "discord.js";
import "dotenv/config";
import { CustomClient } from "./CustomClientType";
import loadCommands from "./loadCommands";
import loadEvents from "./loadEvents";

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessageReactions,
  ],
}) as CustomClient;

client.commands = new Collection();

loadCommands(client);
loadEvents(client);

client.once("ready", () => {
  client.user?.setPresence({
    status: "online",
    activities: [
      {
        name: "Do it with Finesse!",
        type: ActivityType.Custom,
      },
    ],
  });
});

client.login(process.env.bot_token);

// Handle unhandled promise rejections
process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
});
