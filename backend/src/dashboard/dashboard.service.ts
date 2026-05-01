import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TaskStatus } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(userId: string) {
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
        status: { not: TaskStatus.DONE },
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
}
