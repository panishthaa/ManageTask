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
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let ProjectsService = class ProjectsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        return this.prisma.$transaction(async (tx) => {
            const project = await tx.project.create({
                data: {
                    name: dto.name,
                    description: dto.description,
                    createdById: userId,
                },
            });
            await tx.projectMember.create({
                data: {
                    projectId: project.id,
                    userId: userId,
                    role: client_1.ProjectRole.ADMIN,
                },
            });
            return project;
        });
    }
    async findAll(userId) {
        return this.prisma.project.findMany({
            where: {
                members: {
                    some: { userId },
                },
            },
            include: {
                _count: {
                    select: { tasks: true, members: true },
                },
            },
        });
    }
    async findOne(id, userId) {
        const project = await this.prisma.project.findFirst({
            where: {
                id,
                members: {
                    some: { userId },
                },
            },
            include: {
                members: {
                    include: {
                        user: {
                            select: { id: true, name: true, email: true },
                        },
                    },
                },
                creator: {
                    select: { id: true, name: true, email: true },
                },
            },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found or access denied');
        }
        return project;
    }
    async update(id, userId, dto) {
        await this.ensureIsProjectAdmin(id, userId);
        return this.prisma.project.update({
            where: { id },
            data: dto,
        });
    }
    async remove(id, userId) {
        await this.ensureIsProjectAdmin(id, userId);
        return this.prisma.project.delete({
            where: { id },
        });
    }
    async addMember(projectId, adminId, dto) {
        await this.ensureIsProjectAdmin(projectId, adminId);
        return this.prisma.projectMember.create({
            data: {
                projectId,
                userId: dto.userId,
                role: dto.role,
            },
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
            },
        });
    }
    async removeMember(projectId, adminId, userIdToRemove) {
        await this.ensureIsProjectAdmin(projectId, adminId);
        return this.prisma.projectMember.delete({
            where: {
                projectId_userId: {
                    projectId,
                    userId: userIdToRemove,
                },
            },
        });
    }
    async ensureIsProjectAdmin(projectId, userId) {
        const membership = await this.prisma.projectMember.findUnique({
            where: {
                projectId_userId: {
                    projectId,
                    userId,
                },
            },
        });
        if (!membership || membership.role !== client_1.ProjectRole.ADMIN) {
            throw new common_1.ForbiddenException('Only project admins can perform this action');
        }
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map