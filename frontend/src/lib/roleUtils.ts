/**  Returns the URL prefix for the current user's role.
 *   student → ''  |  teacher → '/teacher'  |  parent → '/parent'  |  institution → '/institution'
 */
export function getRolePrefix(): string {
    const role = localStorage.getItem('estudy-role') ?? 'student'
    switch (role) {
        case 'teacher': return '/teacher'
        case 'parent': return '/parent'
        case 'institution': return '/institution'
        default: return ''
    }
}

/** Build a role-aware path.  rolePath('/chat') → '/teacher/chat' for teachers. */
export function rolePath(path: string): string {
    return getRolePrefix() + path
}
