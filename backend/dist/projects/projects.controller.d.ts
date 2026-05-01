import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AddMemberDto } from './dto/add-member.dto';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    create(user: any, createProjectDto: CreateProjectDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        createdById: string;
    }>;
    findAll(user: any): Promise<({
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
    findOne(id: string, user: any): Promise<{
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
    update(id: string, user: any, updateProjectDto: UpdateProjectDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        createdById: string;
    }>;
    remove(id: string, user: any): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        createdById: string;
    }>;
    addMember(id: string, user: any, addMemberDto: AddMemberDto): Promise<{
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
    removeMember(id: string, userId: string, user: any): Promise<{
        id: string;
        userId: string;
        role: import("@prisma/client").$Enums.ProjectRole;
        joinedAt: Date;
        projectId: string;
    }>;
}
