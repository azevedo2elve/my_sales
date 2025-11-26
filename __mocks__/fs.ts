export const promises = {
  stat: async () => true,
  unlink: async () => undefined,
  readFile: async () => Buffer.from(''),
  writeFile: async () => undefined,
  mkdir: async () => undefined,
};

export default {
  promises,
};
