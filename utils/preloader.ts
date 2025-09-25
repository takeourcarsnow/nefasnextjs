export const loadingMessages = [
  'Waking up the bots...',
  'Loading bytes...',
  'Tuning circuits...',
  'Mixing code...',
  'Adjusting settings...',
  'Spinning gears...',
  'Connecting dots...',
  'Crunching numbers...',
  'Almost cooked...',
];

const generateFrame = (progress: number) => {
  const width = 24;
  const filled = Math.floor(width * progress);
  const empty = width - filled;
  const percentage = Math.floor(progress * 100);
  const messageIndex = Math.min(
    Math.floor(progress * loadingMessages.length),
    loadingMessages.length - 1
  );
  const message = loadingMessages[messageIndex];
  const completionLine = progress >= 1 ? '...All systems go!' : ' ';
  return `nefas.tv v1.0\n\n[${'='.repeat(filled)}>${' '.repeat(empty)}] ${percentage}%\n\n${message}\n${completionLine}`;
};

export const preloaderFrames: string[] = Array.from(
  { length: 50 },
  (_, i) => generateFrame(i / 49)
);
