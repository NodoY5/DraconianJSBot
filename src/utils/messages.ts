import { MessageEmbed, MessageButton, MessageActionRow } from 'discord.js';

import { ColorResolvable } from 'discord.js';

import type {
  EmbedFieldData,
  Message,
  MessageComponentInteraction,
  CollectorFilter,
} from 'discord.js';

type ConfirmInformationButtons = {
  title: string;
  fields: EmbedFieldData[];
  message: Message;
};

export async function confirmInformationButtons({
  title,
  fields,
  message,
}: ConfirmInformationButtons): Promise<boolean> {
  const now = Date.now();
  const embed = new MessageEmbed().setTitle(title).addFields(fields);

  const confirmId = `CONFIRM_${now}`;
  const cancelId = `CANCEL_${now}`;

  const buttonSuccess = new MessageButton()
    .setStyle('SUCCESS')
    .setLabel('Confirm')
    .setCustomId(confirmId);
  const buttonCancel = new MessageButton()
    .setStyle('DANGER')
    .setLabel('Cancel')
    .setCustomId(cancelId);

  const row = new MessageActionRow().addComponents(buttonSuccess, buttonCancel);

  const respondAwaiting = await message.channel.send({
    embeds: [embed],
    components: [row],
  });

  const filter: CollectorFilter<[MessageComponentInteraction]> = inter => {
    return (
      [confirmId, cancelId].includes(inter.customId) &&
      inter.user.id === message.author.id
    );
  };

  const interaction = await respondAwaiting.awaitMessageComponent({
    filter,
    time: 30_000,
  });

  if (respondAwaiting.deletable) respondAwaiting.delete();

  return interaction.customId === confirmId;
}

type CallbackEmbed = {
  text: string;
  message: Message;
  color: ColorResolvable;
};

export function callbackEmbed({ text, message, color }: CallbackEmbed): void {
  const embed = new MessageEmbed().setDescription(text).setColor(color);
  if (message.channel.isText()) {
    message.reply({
      embeds: [embed],
    });
  }
}