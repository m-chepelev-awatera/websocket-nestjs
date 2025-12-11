const messageTypes = {
  system: 'Системное',
  user: 'Пользовательское',
  log: 'Лог',
  todo: 'Todo',
};

export type MessageType = keyof typeof messageTypes;
export const messageTypeKeys = Object.keys(messageTypes) as MessageType[];
