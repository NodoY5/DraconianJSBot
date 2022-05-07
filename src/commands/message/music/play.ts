import { callbackEmbed } from '../../../utils/messages';

import type { TextCommand } from '../../../sturctures/command';

export const command: TextCommand = {
  data: {
    name: 'play',
    aliases: ['p'],
    description: 'Play song.',
    inVoiceChannelRequired: true,
  },
  run: async ({ message, args }) => {
    const { member } = message;

    const string = args.join(' ');

    if (!member) return;

    const vc = member.voice.channel;

    if (!vc) return;

    if (!string) {
      callbackEmbed({
        message,
        text: `Please enter a song url or query to search.`,
        color: 'RED',
        mode: 'error',
      });
    }

    message.client.distube.play(vc, string);
  },
};