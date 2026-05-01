import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { ProjectRole } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateProjectDto) {
    return this.prisma.$transaction(async (tx) => {
      const project = await tx.project.create({
        data: {
          name: dto.name,
          description: dto.description,
          createdById: userId,
        },
      });

      // Creator automatically becomes Admin member
      await tx.projectMember.create({
        data: {
          projectId: project.id,
          userId: userId,
          role: ProjectRole.ADMIN,
        },
      });

      return project;
    });
  }

  async findAll(userId: string) {
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

  async findOne(id: string, userId: string) {
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
      throw new NotFoundException('Project not found or access denied');
    }

    return project;
  }

  async update(id: string, userId: string, dto: UpdateProjectDto) {
    await this.ensureIsProjectAdmin(id, userId);

    return this.prisma.project.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, userId: string) {
    await this.ensureIsProjectAdmin(id, userId);

    return this.prisma.project.delete({
      where: { id },
    });
  }

  async addMember(projectId: string, adminId: string, dto: AddMemberDto) {
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

  async removeMember(projectId: string, adminId: string, userIdToRemove: string) {
    await this.ensureIsProjectAdmin(projectId, adminId);

    // Prevent removing the last admin or the creator if needed, 
    // but for now, simple removal.
    
    return this.prisma.projectMember.delete({
      where: {
        projectId_userId: {
          projectId,
          userId: userIdToRemove,
        },
      },
    });
  }

  private async ensureIsProjectAdmin(projectId: string, userId: string) {
    const membership = await this.prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });

    if (!membership || membership.role !== ProjectRole.ADMIN) {
      throw new ForbiddenException('Only project admins can perform this action');
    }
  }
}
