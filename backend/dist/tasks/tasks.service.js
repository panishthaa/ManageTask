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
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let TasksService = class TasksService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        await this.ensureIsProjectMember(dto.projectId, userId);
        if (dto.assigneeId) {
            await this.ensureIsProjectMember(dto.projectId, dto.assigneeId);
        }
        return this.prisma.task.create({
            data: {
                ...dto,
                createdById: userId,
                dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
            },
            include: {
                assignee: { select: { id: true, name: true } },
                creator: { select: { id: true, name: true } },
            },
        });
    }
    async findAll(projectId, userId) {
        await this.ensureIsProjectMember(projectId, userId);
        return this.prisma.task.findMany({
            where: { projectId },
            include: {
                assignee: { select: { id: true, name: true } },
                creator: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id, userId) {
        const task = await this.prisma.task.findUnique({
            where: { id },
            include: {
                assignee: { select: { id: true, name: true } },
                creator: { select: { id: true, name: true } },
            },
        });
        if (!task) {
            throw new common_1.NotFoundException('Task not found');
        }
        await this.ensureIsProjectMember(task.projectId, userId);
        return task;
    }
    async update(id, userId, dto) {
        const task = await this.prisma.task.findUnique({
            where: { id },
        });
        if (!task) {
            throw new common_1.NotFoundException('Task not found');
        }
        const membership = await this.ensureIsProjectMember(task.projectId, userId);
        if (membership.role !== client_1.ProjectRole.ADMIN && task.assigneeId !== userId) {
            throw new common_1.ForbiddenException('Not authorized to update this task');
        }
        if (dto.assigneeId) {
            await this.ensureIsProjectMember(task.projectId, dto.assigneeId);
        }
        return this.prisma.task.update({
            where: { id },
            data: {
                ...dto,
                dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
            },
            include: {
                assignee: { select: { id: true, name: true } },
                creator: { select: { id: true, name: true } },
            },
        });
    }
    async remove(id, userId) {
        const task = await this.prisma.task.findUnique({
            where: { id },
        });
        if (!task) {
            throw new common_1.NotFoundException('Task not found');
        }
        const membership = await this.prisma.projectMember.findUnique({
            where: {
                projectId_userId: {
                    projectId: task.projectId,
                    userId,
                },
            },
        });
        if (!membership || membership.role !== client_1.ProjectRole.ADMIN) {
            throw new common_1.ForbiddenException('Only project admins can delete tasks');
        }
        return this.prisma.task.delete({
            where: { id },
        });
    }
    async ensureIsProjectMember(projectId, userId) {
        const membership = await this.prisma.projectMember.findUnique({
            where: {
                projectId_userId: {
                    projectId,
                    userId,
                },
            },
        });
        if (!membership) {
            throw new common_1.ForbiddenException('You are not a member of this project');
        }
        return membership;
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TasksService);
//# sourceMappingURL=tasks.service.js.map