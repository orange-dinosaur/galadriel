export type RegisterFormState = {
    code?: number;
    message?: string;
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
};

export type LoginFormState = {
    code?: number;
    message?: string;
    email?: string;
    password?: string;
};
