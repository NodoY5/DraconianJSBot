import { callbackEmbed } from '../../../utils/messages';

import type { TextCommand } from '../../../sturctures/command';

export const command: TextCommand = {
  data: {
    name: 'stop',
    description: 'Srop song.',
    inVoiceChannelRequired: true,
  },
  run: async ({ message }) => {
    const { member } = message;

    if (!member) return;

    const vc = member.voice.channel;

    if (!vc) return;

    const queue = message.client.distube.getQueue(message);

    if (!queue) {
      return callbackEmbed({
        message,
        text: `There is **NOTHING** in the queue right now!`,
        color: 'RED',
        mode: 'error',
      });
    }

    queue.stop();

    callbackEmbed({
      message,
      text: `Music **STOPPED**!`,
      color: 'GREEN',
      mode: 'success',
    });
  },
};