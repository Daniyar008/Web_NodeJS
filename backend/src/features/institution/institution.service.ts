import { prisma } from '../../lib/prisma.js'
import { ApiError } from '../../lib/apiError.js'
import type {
    CreateInstitutionDto,
    UpdateInstitutionDto,
    CreateDepartmentDto,
    UpdateDepartmentDto,
    CreateClassDto,
    UpdateClassDto,
    AddMemberDto,
} from './institution.schema.js'

/** Remove `undefined` values so Prisma's exactOptionalPropertyTypes is satisfied */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function clean<T extends object>(obj: T): any {
    return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined))
}

// ─── Institution ─────────────────────────────────────────────────────────────

export async function listInstitutions() {
    return prisma.institution.findMany({
        orderBy: { name: 'asc' },
        include: {
            _count: { select: { departments: true, memberships: true } },
        },
    })
}

export async function getInstitutionById(id: string) {
    const inst = await prisma.institution.findUnique({
        where: { id },
        include: {
            departments: {
                include: {
                    classes: true,
                    _count: { select: { classes: true } },
                },
                orderBy: { name: 'asc' },
            },
            _count: { select: { memberships: true } },
        },
    })
    if (!inst) throw ApiError.notFound('Учреждение не найдено')
    return inst
}

export async function createInstitution(dto: CreateInstitutionDto) {
    const exists = await prisma.institution.findUnique({ where: { slug: dto.slug } })
    if (exists) throw ApiError.conflict('Учреждение с таким slug уже существует')
    return prisma.institution.create({ data: clean(dto) })
}

export async function updateInstitution(id: string, dto: UpdateInstitutionDto) {
    await getInstitutionById(id)
    if (dto.slug) {
        const exists = await prisma.institution.findFirst({ where: { slug: dto.slug, NOT: { id } } })
        if (exists) throw ApiError.conflict('Slug уже занят')
    }
    return prisma.institution.update({ where: { id }, data: clean(dto) })
}

export async function deleteInstitution(id: string) {
    await getInstitutionById(id)
    await prisma.institution.delete({ where: { id } })
}

// ─── Departments ──────────────────────────────────────────────────────────────

export async function createDepartment(institutionId: string, dto: CreateDepartmentDto) {
    await getInstitutionById(institutionId)
    return prisma.department.create({ data: { institutionId, ...clean(dto) } })
}

export async function updateDepartment(institutionId: string, departmentId: string, dto: UpdateDepartmentDto) {
    const dept = await prisma.department.findFirst({ where: { id: departmentId, institutionId } })
    if (!dept) throw ApiError.notFound('Отделение не найдено')
    return prisma.department.update({ where: { id: departmentId }, data: clean(dto) })
}

export async function deleteDepartment(institutionId: string, departmentId: string) {
    const dept = await prisma.department.findFirst({ where: { id: departmentId, institutionId } })
    if (!dept) throw ApiError.notFound('Отделение не найдено')
    await prisma.department.delete({ where: { id: departmentId } })
}

// ─── Classes ──────────────────────────────────────────────────────────────────

export async function createClass(institutionId: string, dto: CreateClassDto) {
    const dept = await prisma.department.findFirst({ where: { id: dto.departmentId, institutionId } })
    if (!dept) throw ApiError.notFound('Отделение не найдено в данном учреждении')
    return prisma.class.create({ data: clean(dto) })
}

export async function updateClass(institutionId: string, classId: string, dto: UpdateClassDto) {
    const cls = await prisma.class.findFirst({
        where: { id: classId, department: { institutionId } },
    })
    if (!cls) throw ApiError.notFound('Класс не найден')
    return prisma.class.update({ where: { id: classId }, data: clean(dto) })
}

export async function deleteClass(institutionId: string, classId: string) {
    const cls = await prisma.class.findFirst({
        where: { id: classId, department: { institutionId } },
    })
    if (!cls) throw ApiError.notFound('Класс не найден')
    await prisma.class.delete({ where: { id: classId } })
}

// ─── Members ──────────────────────────────────────────────────────────────────

export async function listMembers(institutionId: string) {
    await getInstitutionById(institutionId)
    return prisma.institutionMember.findMany({
        where: { institutionId },
        include: {
            user: { select: { id: true, email: true, firstName: true, lastName: true } },
            class: { select: { id: true, name: true } },
        },
        orderBy: { joinedAt: 'desc' },
    })
}

export async function addMember(institutionId: string, dto: AddMemberDto) {
    await getInstitutionById(institutionId)
    const user = await prisma.user.findUnique({ where: { id: dto.userId } })
    if (!user) throw ApiError.notFound('Пользователь не найден')

    const existing = await prisma.institutionMember.findUnique({
        where: { userId_institutionId: { userId: dto.userId, institutionId } },
    })
    if (existing) throw ApiError.conflict('Пользователь уже является участником данного учреждения')

    if (dto.classId) {
        const cls = await prisma.class.findFirst({ where: { id: dto.classId, department: { institutionId } } })
        if (!cls) throw ApiError.notFound('Класс не принадлежит данному учреждению')
    }

    return prisma.institutionMember.create({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: clean({ institutionId, userId: dto.userId, role: dto.role, classId: dto.classId }) as any,
        include: {
            user: { select: { id: true, email: true, firstName: true, lastName: true } },
        },
    })
}

export async function removeMember(institutionId: string, memberId: string) {
    const member = await prisma.institutionMember.findFirst({ where: { id: memberId, institutionId } })
    if (!member) throw ApiError.notFound('Участник не найден')
    await prisma.institutionMember.delete({ where: { id: memberId } })
}
