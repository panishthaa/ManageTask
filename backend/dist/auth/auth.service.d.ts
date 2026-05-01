import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    signup(dto: SignupDto): Promise<{
        email: string;
        name: string;
        id: string;
        globalRole: import("@prisma/client").$Enums.GlobalRole;
        createdAt: Date;
        updatedAt: Date;
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.GlobalRole;
        };
    }>;
    validateUser(userId: string): Promise<{
        email: string;
        name: string;
        id: string;
        globalRole: import("@prisma/client").$Enums.GlobalRole;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
}
