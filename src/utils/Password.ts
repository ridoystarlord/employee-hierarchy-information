import * as bcrypt from 'bcrypt';

export const HashedPassword = async (password: string): Promise<string> => {
  const saltOrRounds = 10;
  const hash = await bcrypt.hash(password, saltOrRounds);
  return hash;
};

export const IsPasswordMatched = async (
  password: string,
  hashPassword: string,
): Promise<boolean> => {
  const isMatch = await bcrypt.compare(password, hashPassword);
  return isMatch;
};
