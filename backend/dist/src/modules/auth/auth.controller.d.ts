import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    telegramLogin(telegramData: any): Promise<{
        access_token: string;
    }>;
}
