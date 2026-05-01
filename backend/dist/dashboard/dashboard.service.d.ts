import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getStats(userId: string): Promise<{
        totalTasks: number;
        stats: {};
        overdueTasks: number;
        recentTasks: ({
            project: {
                name: string;
            };
            assignee: {
                name: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            createdById: string;
            projectId: string;
            title: string;
            status: import("@prisma/client").$Enums.TaskStatus;
            priority: import("@prisma/client").$Enums.TaskPriority;
            dueDate: Date | null;
            assigneeId: string | null;
        })[];
        totalProjects: number;
    }>;
}
