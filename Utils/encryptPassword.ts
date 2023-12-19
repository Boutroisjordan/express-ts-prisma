import bcrypt from "bcrypt"
const SALT_ROUNDS = 10;

const encryptPassword = async (password: string): Promise<string> => {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);

    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  } catch (error) {
    throw new Error('Erreur lors du hachage du mot de passe');
  }
};

export default encryptPassword;