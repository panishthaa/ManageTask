"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStats(userId) {
        const userProjects = await this.prisma.project.findMany({
            where: {
                members: { some: { userId } },
            },
            select: { id: true },
        });
        const projectIds = userProjects.map((p) => p.id);
        const totalTasks = await this.prisma.task.count({
            where: { projectId: { in: projectIds } },
        });
        const tasksByStatus = await this.prisma.task.groupBy({
            by: ['status'],
            where: { projectId: { in: projectIds } },
            _count: true,
        });
        const overdueTasks = await this.prisma.task.count({
            where: {
                projectId: { in: projectIds },
                status: { not: client_1.TaskStatus.DONE },
                dueDate: { lt: new Date() },
            },
        });
        const recentTasks = await this.prisma.task.findMany({
            where: { projectId: { in: projectIds } },
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                project: { select: { name: true } },
                assignee: { select: { name: true } },
            },
        });
        return {
            totalTasks,
            stats: tasksByStatus.reduce((acc, curr) => {
                acc[curr.status] = curr._count;
                return acc;
            }, {}),
            overdueTasks,
            recentTasks,
            totalProjects: projectIds.length,
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map