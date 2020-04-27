export interface User{
    uid: string;
    email: string;
    isAdmin: boolean;
    isUser: boolean;
}

export interface LoginStore{
    pass: string;
    username;
}