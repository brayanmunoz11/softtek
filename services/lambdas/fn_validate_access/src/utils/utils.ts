export class Utils {
  static verifyIat(exp?: number): boolean {
    let isValid = false;

    try {
      if (!exp) return false;

      const expiration = new Date(exp * 1000); // `exp` es en segundos, JS usa milisegundos
      const now = new Date();

      if (now <= expiration) {
        isValid = true;
      }
    } catch {
      return false;
    }

    return isValid;
  }
}