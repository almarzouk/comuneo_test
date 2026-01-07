// Auth Validation - التحقق من صحة بيانات المصادقة
// يمكن استخدامه من جانب العميل والخادم

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  name: string;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

/**
 * التحقق من صحة بريد إلكتروني
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * التحقق من قوة كلمة المرور
 */
function isStrongPassword(password: string): {
  valid: boolean;
  message?: string;
} {
  if (password.length < 8) {
    return {
      valid: false,
      message: "Das Passwort muss mindestens 8 Zeichen lang sein.",
    };
  }

  if (password.length > 256) {
    return {
      valid: false,
      message: "Das Passwort darf maximal 256 Zeichen lang sein.",
    };
  }

  // التحقق من وجود حرف كبير
  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      message: "Das Passwort muss mindestens einen Großbuchstaben enthalten.",
    };
  }

  // التحقق من وجود حرف صغير
  if (!/[a-z]/.test(password)) {
    return {
      valid: false,
      message: "Das Passwort muss mindestens einen Kleinbuchstaben enthalten.",
    };
  }

  // التحقق من وجود رقم
  if (!/[0-9]/.test(password)) {
    return {
      valid: false,
      message: "Das Passwort muss mindestens eine Zahl enthalten.",
    };
  }

  return { valid: true };
}

/**
 * التحقق من بيانات تسجيل الدخول
 */
export function validateLoginCredentials(
  email: string,
  password: string
): ValidationResult {
  const fieldErrors: Record<string, string> = {};

  // التحقق من البريد الإلكتروني
  if (!email) {
    fieldErrors.email = "E-Mail ist erforderlich.";
  } else if (!isValidEmail(email)) {
    fieldErrors.email = "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
  }

  // التحقق من كلمة المرور
  if (!password) {
    fieldErrors.password = "Passwort ist erforderlich.";
  } else if (password.length < 8) {
    fieldErrors.password = "Das Passwort muss mindestens 8 Zeichen lang sein.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      valid: false,
      error: "Bitte korrigieren Sie die Fehler.",
      fieldErrors,
    };
  }

  return { valid: true };
}

/**
 * التحقق من بيانات التسجيل
 */
export function validateSignupCredentials(
  email: string,
  password: string,
  name: string
): ValidationResult {
  const fieldErrors: Record<string, string> = {};

  // التحقق من الاسم
  if (!name) {
    fieldErrors.name = "Name ist erforderlich.";
  } else if (name.length < 2) {
    fieldErrors.name = "Der Name muss mindestens 2 Zeichen lang sein.";
  } else if (name.length > 128) {
    fieldErrors.name = "Der Name darf maximal 128 Zeichen lang sein.";
  }

  // التحقق من البريد الإلكتروني
  if (!email) {
    fieldErrors.email = "E-Mail ist erforderlich.";
  } else if (!isValidEmail(email)) {
    fieldErrors.email = "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
  }

  // التحقق من كلمة المرور
  if (!password) {
    fieldErrors.password = "Passwort ist erforderlich.";
  } else {
    const passwordCheck = isStrongPassword(password);
    if (!passwordCheck.valid) {
      fieldErrors.password = passwordCheck.message!;
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      valid: false,
      error: "Bitte korrigieren Sie die Fehler.",
      fieldErrors,
    };
  }

  return { valid: true };
}

/**
 * التحقق من اسم المستخدم (للاستخدام المستقبلي)
 */
export function validateUsername(username: string): ValidationResult {
  const fieldErrors: Record<string, string> = {};

  if (!username) {
    fieldErrors.username = "Benutzername ist erforderlich.";
  } else if (username.length < 3) {
    fieldErrors.username =
      "Der Benutzername muss mindestens 3 Zeichen lang sein.";
  } else if (username.length > 32) {
    fieldErrors.username =
      "Der Benutzername darf maximal 32 Zeichen lang sein.";
  } else if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    fieldErrors.username =
      "Der Benutzername darf nur Buchstaben, Zahlen, Unterstriche und Bindestriche enthalten.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      valid: false,
      error: "Ungültiger Benutzername.",
      fieldErrors,
    };
  }

  return { valid: true };
}
