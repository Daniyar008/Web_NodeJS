import { describe, it, expect, beforeEach } from 'vitest'
import { setTokens, getAccessToken, clearTokens, decodeAccessToken, backendRoleToFrontend } from '../lib/api'

beforeEach(() => {
    localStorage.clear()
})

describe('Token storage', () => {
    it('stores and retrieves access token', () => {
        setTokens('access-123', 'refresh-456')
        expect(getAccessToken()).toBe('access-123')
    })

    it('returns null when no token stored', () => {
        expect(getAccessToken()).toBeNull()
    })

    it('clears all tokens', () => {
        setTokens('a', 'r')
        localStorage.setItem('estudy-role', 'student')
        clearTokens()
        expect(getAccessToken()).toBeNull()
        expect(localStorage.getItem('estudy-refresh')).toBeNull()
        expect(localStorage.getItem('estudy-role')).toBeNull()
    })
})

describe('decodeAccessToken', () => {
    function makeJwt(payload: object): string {
        const encoded = btoa(JSON.stringify(payload))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '')
        return `header.${encoded}.signature`
    }

    it('decodes a valid JWT payload', () => {
        const payload = { sub: '1', email: 'test@test.com', role: 'STUDENT', exp: 9999999999 }
        const token = makeJwt(payload)
        const decoded = decodeAccessToken(token)
        expect(decoded).toEqual(payload)
    })

    it('returns null for invalid token', () => {
        expect(decodeAccessToken('not-a-jwt')).toBeNull()
        expect(decodeAccessToken('')).toBeNull()
    })

    it('handles base64url padding correctly', () => {
        const payload = { sub: '123456789', email: 'a@b.c', role: 'TEACHER', exp: 1 }
        const token = makeJwt(payload)
        expect(decodeAccessToken(token)).toEqual(payload)
    })
})

describe('backendRoleToFrontend', () => {
    it('maps known roles', () => {
        expect(backendRoleToFrontend('STUDENT')).toBe('student')
        expect(backendRoleToFrontend('TEACHER')).toBe('teacher')
        expect(backendRoleToFrontend('PARENT')).toBe('parent')
        expect(backendRoleToFrontend('INSTITUTION_ADMIN')).toBe('institution')
    })

    it('defaults unknown roles to student', () => {
        expect(backendRoleToFrontend('UNKNOWN')).toBe('student')
    })
})
