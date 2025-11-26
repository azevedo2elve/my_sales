export const hash = async (
  data: string,
  saltOrRounds: string | number,
): Promise<string> => {
  return `hashed-${data}`;
};

export const compare = async (
  data: string,
  encrypted: string,
): Promise<boolean> => {
  // Simula a comparação correta
  const expectedHash = `hashed-${data}`;
  return encrypted === expectedHash;
};

export const genSalt = async (rounds?: number): Promise<string> => {
  return 'fake-salt';
};

export default {
  hash,
  compare,
  genSalt,
};
