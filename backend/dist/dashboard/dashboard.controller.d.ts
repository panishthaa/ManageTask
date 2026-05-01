import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getStats(user: any): Promise<{
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
