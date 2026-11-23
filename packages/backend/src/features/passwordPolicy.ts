import { AppError } from "./errors";

/**
 * Same rules as the signup and reset-password forms of the frontend (SignupPasswordInput):
 * at least 8 characters, one ASCII uppercase letter, one ASCII lowercase letter, one digit
 * and one character that is none of these (accented letters count as special, as in the form).
 */
export const isPasswordStrongEnough = (password: string) =>
  password.length >= 8 &&
  /\d/.test(password) &&
  /[A-Z]/.test(password) &&
  /[a-z]/.test(password) &&
  /[^A-Za-z0-9]/.test(password);

export const assertPasswordIsStrongEnough = (password: string) => {
  if (!isPasswordStrongEnough(password)) {
    throw new AppError(
      400,
      "Le mot de passe doit contenir au moins 8 caractères, dont une majuscule, une minuscule, un chiffre et un caractère spécial.",
    );
  }
};
