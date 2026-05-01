import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AddMemberDto } from './dto/add-member.dto';
export declare class ProjectsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateProjectDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        createdById: string;
    }>;
    findAll(userId: string): Promise<({
        _count: {
            members: number;
            tasks: number;
        };
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        createdById: string;
    })[]>;
    findOne(id: string, userId: string): Promise<{
        creator: {
            email: string;
            name: string;
            id: string;
        };
        members: ({
            user: {
                email: string;
                name: string;
                id: string;
            };
        } & {
            id: string;
            userId: string;
            role: import("@prisma/client").$Enums.ProjectRole;
            joinedAt: Date;
            projectId: string;
        })[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        createdById: string;
    }>;
    update(id: string, userId: string, dto: UpdateProjectDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        createdById: string;
    }>;
    remove(id: string, userId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        createdById: string;
    }>;
    addMember(projectId: string, adminId: string, dto: AddMemberDto): Promise<{
        user: {
            email: string;
            name: string;
            id: string;
        };
    } & {
        id: string;
        userId: string;
        role: import("@prisma/client").$Enums.ProjectRole;
        joinedAt: Date;
        projectId: string;
    }>;
    removeMember(projectId: string, adminId: string, userIdToRemove: string): Promise<{
        id: string;
        userId: string;
        role: import("@prisma/client").$Enums.ProjectRole;
        joinedAt: Date;
        projectId: string;
    }>;
    private ensureIsProjectAdmin;
}
