import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        email: string;
        name: string;
        id: string;
        globalRole: import("@prisma/client").$Enums.GlobalRole;
    }[]>;
    findOne(id: string): Promise<{
        email: string;
        name: string;
        id: string;
        globalRole: import("@prisma/client").$Enums.GlobalRole;
    }>;
}
