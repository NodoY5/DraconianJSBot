import {
  guildConfiguration,
  snipeDatabase,
  ensureSnipeChannel,
  ensureServerData,
} from '../../utils/database';

import type { Message } from 'discord.js';
import type { DiscordEvent } from '../../sturctures/event';

export const event: DiscordEvent = {
  name: 'messageDelete',
  run: async (_, message: Message) => {
    // if (message.partial) {
    //   await message.fetch();
    // }

    const { guild, channel, content, attachments, author, client } = message;

    const condition = channel.isThread() || channel.isText();

    if (guild && condition) {
      const config = guildConfiguration.get(guild.id);

      ensureServerData(guild.id);

      // Validate whether it can be stored into Sniping system.
      if (
        !config?.snipe.channelDisabled.includes(channel.id) &&
        client.user?.id !== author.id
      ) {
        ensureSnipeChannel(channel.id);

        const snipes = snipeDatabase.get(channel.id);

        const modelData = snipes ?? { data: [] };

        if (!modelData.data) {
          modelData.data = [];
        }

        const snipe = {
          author: {
            id: author.id,
            name: author.tag,
          },
          content: {
            text: content,
            date: Date.now(),
            imageURL: attachments.first()?.proxyURL,
          },
        };

        modelData.data.unshift(snipe);

        if (modelData.data.length >= 4) {
          modelData.data.pop();
        }

        console.log(modelData.data);

        // Set to database.
        snipeDatabase.set(channel.id, modelData);
      }
    }
  },
};
