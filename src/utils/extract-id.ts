import { WAMessageKey } from '@whiskeysockets/baileys';

const isJid = (v: string) => {
  const regexp = new RegExp(/^\w+@(s.whatsapp.net|g.us|broadcast|newsletter)$/i);
  return regexp.test(v);
};

const isLid = (v: string) => v.endsWith('@lid');

const extractUser = (...values: (string | undefined)[]) => {
  let jid: string | undefined;
  let lid: string | undefined;

  for (const v of values) {
    if (!v) continue;

    if (!lid && isLid(v)) {
      lid = v;
    }

    if (!jid && isJid(v)) {
      jid = v;
    }
  }

  return { jid, lid };
};

export const getJidUser = (key: WAMessageKey) => {
  // remoteJidAlt is a Baileys 7.x-only field (LID/PN alt addressing); read it
  // defensively so this compiles on 6.7.x and stays forward-compatible.
  return extractUser(key?.remoteJid, key?.remoteJid, (key as any)?.remoteJidAlt);
};

export const getUserGroup = (key: WAMessageKey, participant?: string) => {
  return extractUser(key?.participant, (key as any)?.participantAlt, participant);
};
