import { ApiError } from '../../lib/apiError.js'
import { prisma } from '../../lib/prisma.js'
import type { CreateTaskDto, UpdateTaskDto } from './task.schema.js'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function clean<T extends object>(obj: T): any {
    return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined))
}

export async function listTasks(userId: string) {
    return prisma.todo.findMany({
        where: { userId },
        include: {
            course: { select: { id: true, title: true } },
            assignment: { select: { id: true, title: true } },
        },
        orderBy: [{ status: 'asc' }, { position: 'asc' }, { updatedAt: 'desc' }],
    })
}

export async function listCalendarTasks(userId: string, from?: string, to?: string) {
    return prisma.todo.findMany({
        where: {
            userId,
            dueDate: {
                ...(from ? { gte: new Date(from) } : {}),
                ...(to ? { lte: new Date(to) } : {}),
            },
        },
        orderBy: [{ dueDate: 'asc' }, { priority: 'desc' }],
    })
}

export async function createTask(userId: string, dto: CreateTaskDto) {
    const [maxPos] = await prisma.todo.findMany({
        where: { userId, status: dto.status ?? 'TODO' },
        orderBy: { position: 'desc' },
        take: 1,
        select: { position: true },
    })

    return prisma.todo.create({
        data: clean({
            userId,
            title: dto.title,
            description: dto.description,
            status: dto.status ?? 'TODO',
            priority: dto.priority ?? 'MEDIUM',
            dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
            courseId: dto.courseId,
            assignmentId: dto.assignmentId,
            position: (maxPos?.position ?? -1) + 1,
        }),
        include: {
            course: { select: { id: true, title: true } },
            assignment: { select: { id: true, title: true } },
        },
    })
}

export async function updateTask(userId: string, id: string, dto: UpdateTaskDto) {
    const existing = await prisma.todo.findFirst({ where: { id, userId } })
    if (!existing) throw ApiError.notFound('Задача не найдена')

    const data = clean({
        title: dto.title,
        description: dto.description,
        status: dto.status,
        priority: dto.priority,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : dto.dueDate === '' ? null : undefined,
        courseId: dto.courseId,
        assignmentId: dto.assignmentId,
    })

    return prisma.todo.update({
        where: { id },
        data,
        include: {
            course: { select: { id: true, title: true } },
            assignment: { select: { id: true, title: true } },
        },
    })
}

export async function removeTask(userId: string, id: string) {
    const existing = await prisma.todo.findFirst({ where: { id, userId } })
    if (!existing) throw ApiError.notFound('Задача не найдена')
    await prisma.todo.delete({ where: { id } })
}

export async function reorderTasks(userId: string, tasks: Array<{ id: string; status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'; position: number }>) {
    const ids = tasks.map((t) => t.id)
    const owned = await prisma.todo.count({ where: { id: { in: ids }, userId } })
    if (owned !== ids.length) throw ApiError.forbidden('Некоторые задачи не принадлежат пользователю')

    await prisma.$transaction(
        tasks.map((t) =>
            prisma.todo.update({
                where: { id: t.id },
                data: { status: t.status, position: t.position },
            })
        )
    )

    return listTasks(userId)
}
