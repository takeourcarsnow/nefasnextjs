export interface TerminalLine { text: string; color?: string; delay: number }
export const blogContent: TerminalLine[] = [
  { text: '> ssh blog@nefas.tv -p 2222', color: '#00ff9d', delay: 150 },
  { text: '> Authenticating with neural key...', color: '#00ff9d', delay: 200 },
  { text: '[✓] Access granted to thought repository', color: '#00ff00', delay: 100 },
  { text: '> grep -r "unhinged" ./posts/* | wc -l', color: '#ff00ff', delay: 150 },
  { text: '> 42069 matches found', color: '#ff00ff', delay: 100 },
  { text: '◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢', color: '#ff00ff', delay: 50 },
  { text: '༺ BLOG.MD - WHERE THOUGHTS GO TO DIE ༻', color: '#ffff00', delay: 50 },
  { text: 'too spicy for linkedin, too long for x/twitter', color: '#fff', delay: 30 },
  { text: 'perfect length for procrastination though', color: '#fff', delay: 30 },
  { text: '', delay: 100 },
  { text: '▸ click titles to expand consciousness', color: '#00ff9d', delay: 50 },
  { text: '▸ or scroll past like everyone else ¯\\_(ツ)_/¯', color: '#ff00ff', delay: 30 },
  { text: '', delay: 100 },
  { text: '[✓] Brain dump complete. No memory leaks detected.', color: '#00ff00', delay: 50 },
  { text: '◣◥◣◥◣◥◣◥◣◥◣◥◣◥◣◥◣◥◣◥◣◥◣◥◣◥◣◥', color: '#ff00ff', delay: 50 }
];
