import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
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
