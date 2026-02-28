import type { RegisterFormData } from '@/types/auth';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

export function validateEmail(email: string): string | null {
    const trimmed = email.trim();
    if (!trimmed) {
        return 'E-mail é obrigatório';
    }
    if (!EMAIL_REGEX.test(trimmed)) {
        return 'E-mail inválido';
    }
    return null;
}

export function validatePassword(password: string): string | null {
    if (!password) {
        return 'Senha é obrigatória';
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
        return `Senha deve ter no mínimo ${MIN_PASSWORD_LENGTH} caracteres`;
    }
    return null;
}

export function validatePasswordMatch(password: string, confirmPassword: string): string | null {
    if (password !== confirmPassword) {
        return 'As senhas não coincidem';
    }
    return null;
}

export function validateLoginForm(email: string, password: string): Record<string, string> | null {
    const errors: Record<string, string> = {};

    const emailError = validateEmail(email);
    if (emailError) errors.email = emailError;

    const passwordError = validatePassword(password);
    if (passwordError) errors.password = passwordError;

    return Object.keys(errors).length > 0 ? errors : null;
}

export function validateRegisterForm(data: RegisterFormData): Record<string, string> | null {
    const errors: Record<string, string> = {};

    const emailError = validateEmail(data.email);
    if (emailError) errors.email = emailError;

    const passwordError = validatePassword(data.password);
    if (passwordError) errors.password = passwordError;

    const matchError = validatePasswordMatch(data.password, data.confirmPassword);
    if (matchError) errors.confirmPassword = matchError;

    return Object.keys(errors).length > 0 ? errors : null;
}

export function getFirebaseAuthErrorMessage(errorCode: string): string {
    switch (errorCode) {
        case 'auth/user-not-found':
            return 'Usuário não encontrado. Verifique o e-mail.';
        case 'auth/wrong-password':
            return 'Senha incorreta.';
        case 'auth/invalid-credential':
            return 'Credenciais inválidas. Verifique e-mail e senha.';
        case 'auth/email-already-in-use':
            return 'Este e-mail já está em uso.';
        case 'auth/weak-password':
            return 'Senha muito fraca. Use no mínimo 6 caracteres.';
        case 'auth/too-many-requests':
            return 'Muitas tentativas. Tente novamente mais tarde.';
        case 'auth/network-request-failed':
            return 'Erro de conexão. Verifique sua internet.';
        case 'auth/invalid-email':
            return 'E-mail inválido.';
        case 'auth/user-disabled':
            return 'Esta conta foi desativada.';
        default:
            return 'Ocorreu um erro. Tente novamente.';
    }
}
