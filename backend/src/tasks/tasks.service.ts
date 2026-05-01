import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ProjectRole } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateTaskDto) {
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

  async findAll(projectId: string, userId: string) {
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

  async findOne(id: string, userId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        assignee: { select: { id: true, name: true } },
        creator: { select: { id: true, name: true } },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.ensureIsProjectMember(task.projectId, userId);

    return task;
  }

  async update(id: string, userId: string, dto: UpdateTaskDto) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const membership = await this.ensureIsProjectMember(task.projectId, userId);

    // Permission check: only admin OR assignee can update status
    // For full updates, maybe only admin. 
    // Let's allow members to update status if assigned to them.
    if (membership.role !== ProjectRole.ADMIN && task.assigneeId !== userId) {
      throw new ForbiddenException('Not authorized to update this task');
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

  async remove(id: string, userId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const membership = await this.prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: task.projectId,
          userId,
        },
      },
    });

    if (!membership || membership.role !== ProjectRole.ADMIN) {
      throw new ForbiddenException('Only project admins can delete tasks');
    }

    return this.prisma.task.delete({
      where: { id },
    });
  }

  private async ensureIsProjectMember(projectId: string, userId: string) {
    const membership = await this.prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });

    if (!membership) {
      throw new ForbiddenException('You are not a member of this project');
    }

    return membership;
  }
}
