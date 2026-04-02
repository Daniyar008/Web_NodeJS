import { useEffect, useRef, useState } from 'react'
import {
  FileText, Link2, Mic, MoreVertical, Phone, Plus, Search, Send, Smile, Users, Video, X,
} from 'lucide-react'
import type { Language } from '../i18n/translations'
import {
  conversationData,
  initialThreads,
  ME,
  participants,
} from '../data/chatData'
import type { ChatMessage, ChatThread, UserRole } from '../data/chatData'
import { CourseShellLayout } from './CourseShellLayout'
import { TeacherShellLayout } from './TeacherShellLayout'
import { ParentShellLayout } from './ParentShellLayout'
import { chat as chatApi, type ChatPreview, type ChatMessage as ApiChatMsg } from '../lib/api'

// ─── Constants ────────────────────────────────────────────────────────────────

const ROLE_LABELS: Record<UserRole, string> = {
  teacher: 'Учитель',
  student: 'Ученик',
  parent: 'Родитель',
  institution: 'Учреждение',
}

const GROUP_TYPE_LABELS: Record<string, string> = {
  class: 'Класс',
  teachers: 'Коллектив',
  parents: 'Родители',
  institution: 'Учреждение',
  custom: 'Группа',
}

type DirectFilter = 'all' | UserRole
type MainTab = 'direct' | 'groups'

// ─── Create Group Modal ────────────────────────────────────────────────────────

type CreateGroupModalProps = {
  onClose: () => void
  onCreate: (thread: ChatThread) => void
}

function CreateGroupModal({ onClose, onCreate }: CreateGroupModalProps) {
  const [name, setName] = useState('')
  const [groupType, setGroupType] = useState<string>('class')
  const [picked, setPicked] = useState<Set<string>>(new Set())

  const allParticipants = Object.values(participants)

  function toggleMember(id: string) {
    setPicked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleCreate() {
    if (!name.trim()) return
    const pickedList = allParticipants.filter((p) => picked.has(p.id))
    const thread: ChatThread = {
      id: `g_${Date.now()}`,
      kind: 'group',
      groupName: name.trim(),
      groupType: groupType as ChatThread['groupType'],
      memberAvatars: pickedList.slice(0, 3).map((p) => p.avatar),
      lastMessage: 'Группа создана',
      time: 'сейчас',
      unread: 0,
    }
    onCreate(thread)
    onClose()
  }

  return (
    <div className="chat-modal-overlay" onClick={onClose}>
      <div className="chat-modal" onClick={(e) => e.stopPropagation()}>
        <div className="chat-modal-header">
          <h3>Создать группу</h3>
          <button type="button" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>

        <label className="chat-modal-label">
          Название группы
          <input
            className="chat-modal-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Например: 8А — Математика"
            aria-label="Название группы"
          />
        </label>

        <label className="chat-modal-label">
          Тип группы
          <select
            className="chat-modal-select"
            value={groupType}
            onChange={(e) => setGroupType(e.target.value)}
            aria-label="Тип группы"
          >
            {Object.entries(GROUP_TYPE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </label>

        <p className="chat-modal-label">Участники</p>
        <div className="chat-member-picker">
          {allParticipants.map((p) => (
            <button
              key={p.id}
              type="button"
              className={picked.has(p.id) ? 'chat-member-chip selected' : 'chat-member-chip'}
              onClick={() => toggleMember(p.id)}
            >
              <img src={p.avatar} alt={p.name} className="chat-chip-avatar" />
              <span>{p.name}</span>
              <span className={`chat-role-badge ${p.role}`}>{ROLE_LABELS[p.role]}</span>
            </button>
          ))}
        </div>

        <div className="chat-modal-footer">
          <button type="button" className="chat-modal-cancel" onClick={onClose}>Отмена</button>
          <button type="button" className="chat-modal-create" onClick={handleCreate} disabled={!name.trim()}>
            Создать
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Group avatar stack ────────────────────────────────────────────────────────

function GroupAvatarStack({ avatars, name }: { avatars?: string[]; name?: string }) {
  const list = avatars ?? []
  return (
    <div className="chat-avatar-stack">
      {list.slice(0, 3).map((src, i) => (
        <img key={i} src={src} alt="" className="chat-stack-img" style={{ zIndex: 3 - i }} />
      ))}
      {list.length === 0 && (
        <div className="chat-stack-placeholder">
          <Users size={18} />
          <span>{name?.[0] ?? '?'}</span>
        </div>
      )}
    </div>
  )
}

// ─── Types ────────────────────────────────────────────────────────────────────

type ChatPageProps = {
  language: Language
  onLanguageChange: (lang: Language) => void
  variant?: 'student' | 'teacher' | 'parent'
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ChatPage({ language, onLanguageChange, variant = 'student' }: ChatPageProps) {
  const [mainTab, setMainTab] = useState<MainTab>('direct')
  const [directFilter, setDirectFilter] = useState<DirectFilter>('all')
  const [selectedId, setSelectedId] = useState<string>(variant === 'teacher' ? 't_student1' : 't_teacher1')
  const [search, setSearch] = useState('')
  const [inputText, setInputText] = useState('')
  const [threads, setThreads] = useState<ChatThread[]>(initialThreads)
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(conversationData)
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [showMembers, setShowMembers] = useState(false)
  const [apiChatMap, setApiChatMap] = useState<Record<string, string>>({}) // thread.id → api chat id
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // ── Load real chats from API ──
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const chats: ChatPreview[] = await chatApi.list()
        if (cancelled || chats.length === 0) return
        const apiThreads: ChatThread[] = chats.map((c) => {
          const other = c.participants[0]
          return {
            id: `api_${c.id}`,
            kind: c.type === 'GROUP' ? 'group' as const : 'direct' as const,
            participantId: other ? `api_user_${other.id}` : undefined,
            groupName: c.title ?? undefined,
            lastMessage: c.lastMessage?.content ?? '',
            time: c.lastMessage ? new Date(c.lastMessage.createdAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) : '',
            unread: 0,
          }
        })
        // Register API participants
        for (const c of chats) {
          for (const p of c.participants) {
            const key = `api_user_${p.id}`
            if (!participants[key]) {
              participants[key] = {
                id: key,
                name: `${p.firstName} ${p.lastName}`,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.firstName}`,
                role: 'teacher',
                online: false,
              }
            }
          }
        }
        // Build api chat map (thread id → real chat id)
        const map: Record<string, string> = {}
        for (const c of chats) {
          map[`api_${c.id}`] = c.id
        }
        if (!cancelled) {
          setThreads((prev) => [...apiThreads, ...prev])
          setApiChatMap(map)
          if (apiThreads.length > 0) setSelectedId(apiThreads[0].id)
        }
      } catch {
        // keep mock data
      }
    })()
    return () => { cancelled = true }
  }, [])

  // Load messages when selecting an API chat
  useEffect(() => {
    const realChatId = apiChatMap[selectedId]
    if (!realChatId) return
    if (messages[selectedId]?.length) return // already loaded
    let cancelled = false
    ;(async () => {
      try {
        const msgs: ApiChatMsg[] = await chatApi.messages(realChatId)
        if (cancelled) return
        const mapped: ChatMessage[] = msgs.map((m) => ({
          id: m.id,
          senderId: m.senderId,
          own: m.sender.email === ME.id || m.sender.firstName === ME.name.split(' ')[0],
          text: m.content,
          time: new Date(m.createdAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
          senderName: `${m.sender.firstName} ${m.sender.lastName}`,
        }))
        setMessages((prev) => ({ ...prev, [selectedId]: mapped }))
      } catch { /* keep empty */ }
    })()
    return () => { cancelled = true }
  }, [selectedId, apiChatMap])

  const directThreads = threads.filter((t) => t.kind === 'direct')
  const groupThreads = threads.filter((t) => t.kind === 'group')

  const filteredDirect = directThreads.filter((t) => {
    if (!t.participantId) return false
    const p = participants[t.participantId]
    if (!p) return false
    const matchRole = directFilter === 'all' || p.role === directFilter
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    return matchRole && matchSearch
  })

  const filteredGroups = groupThreads.filter((t) =>
    (t.groupName ?? '').toLowerCase().includes(search.toLowerCase()),
  )

  const selectedThread = threads.find((t) => t.id === selectedId)
  const selectedParticipant =
    selectedThread?.kind === 'direct' && selectedThread.participantId
      ? participants[selectedThread.participantId]
      : undefined
  const currentMessages: ChatMessage[] = messages[selectedId] ?? []

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selectedId, messages])

  function sendMessage() {
    const text = inputText.trim()
    if (!text || !selectedId) return
    const newMsg: ChatMessage = {
      id: `m${Date.now()}`,
      senderId: ME.id,
      own: true,
      text,
      time: 'сейчас',
    }
    setMessages((prev) => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] ?? []), newMsg],
    }))
    setInputText('')
    // Send to API if it's a real chat
    const realChatId = apiChatMap[selectedId]
    if (realChatId) {
      chatApi.send(realChatId, text).catch(() => { /* optimistic — already shown */ })
    }
  }

  function handleCreateGroup(thread: ChatThread) {
    setThreads((prev) => [...prev, thread])
    setMessages((prev) => ({ ...prev, [thread.id]: [] }))
    setSelectedId(thread.id)
    setMainTab('groups')
  }

  const page = (
    <>
      <div className="chat-page">

        {/* ── Contacts panel ───────────────────────────── */}
        <div className="chat-contacts-panel">
          <h2 className="chat-panel-title">Чаты</h2>

          {/* Search */}
          <div className="chat-search">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск"
              aria-label="Поиск контактов"
            />
            <Search size={15} className="chat-search-icon" />
          </div>

          {/* Main tabs: Личные / Группы */}
          <div className="chat-tabs">
            <button
              type="button"
              className={mainTab === 'direct' ? 'chat-tab active' : 'chat-tab'}
              onClick={() => setMainTab('direct')}
            >
              Личные
            </button>
            <button
              type="button"
              className={mainTab === 'groups' ? 'chat-tab active' : 'chat-tab'}
              onClick={() => setMainTab('groups')}
            >
              Группы
            </button>
          </div>

          {/* ── Direct section ── */}
          {mainTab === 'direct' && (
            <>
              {/* Role filter chips */}
              <div className="chat-role-chips">
                {(['all', 'teacher', 'student', 'parent', 'institution'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    className={directFilter === r ? 'chat-chip active' : 'chat-chip'}
                    onClick={() => setDirectFilter(r)}
                  >
                    {r === 'all' ? 'Все' : ROLE_LABELS[r]}
                  </button>
                ))}
              </div>

              <ul className="chat-contact-list">
                {filteredDirect.map((thread) => {
                  const p = thread.participantId ? participants[thread.participantId] : undefined
                  if (!p) return null
                  return (
                    <li key={thread.id}>
                      <button
                        type="button"
                        className={thread.id === selectedId ? 'chat-contact active' : 'chat-contact'}
                        onClick={() => setSelectedId(thread.id)}
                      >
                        <div className="chat-avatar-wrap">
                          <img src={p.avatar} alt={p.name} className="chat-avatar" />
                          {p.online && <span className="chat-dot" />}
                        </div>
                        <div className="chat-contact-info">
                          <div className="chat-contact-name-row">
                            <span className="chat-contact-name">{p.name}</span>
                            <span className={`chat-role-badge ${p.role}`}>{ROLE_LABELS[p.role]}</span>
                          </div>
                          <span className="chat-contact-last">{thread.lastMessage}</span>
                        </div>
                        <div className="chat-contact-meta">
                          <span className="chat-time">{thread.time}</span>
                          {thread.unread > 0 && (
                            <span className="chat-badge">{thread.unread}</span>
                          )}
                        </div>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </>
          )}

          {/* ── Groups section ── */}
          {mainTab === 'groups' && (
            <>
              <button
                type="button"
                className="chat-new-group-btn"
                onClick={() => setShowCreateGroup(true)}
              >
                <Plus size={15} /> Создать группу
              </button>
              <ul className="chat-contact-list">
                {filteredGroups.map((thread) => (
                  <li key={thread.id}>
                    <button
                      type="button"
                      className={thread.id === selectedId ? 'chat-contact active' : 'chat-contact'}
                      onClick={() => setSelectedId(thread.id)}
                    >
                      <GroupAvatarStack avatars={thread.memberAvatars} name={thread.groupName} />
                      <div className="chat-contact-info">
                        <div className="chat-contact-name-row">
                          <span className="chat-contact-name">{thread.groupName}</span>
                          {thread.groupType && (
                            <span className={`chat-group-badge ${thread.groupType}`}>
                              {GROUP_TYPE_LABELS[thread.groupType] ?? thread.groupType}
                            </span>
                          )}
                        </div>
                        <span className="chat-contact-last">{thread.lastMessage}</span>
                      </div>
                      <div className="chat-contact-meta">
                        <span className="chat-time">{thread.time}</span>
                        {thread.unread > 0 && (
                          <span className="chat-badge">{thread.unread}</span>
                        )}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* ── Conversation panel ───────────────────────── */}
        {selectedThread ? (
          <div className="chat-conversation">
            {/* Header */}
            <div className="chat-conv-header">
              <div className="chat-conv-who">
                {selectedThread.kind === 'direct' && selectedParticipant ? (
                  <>
                    <div className="chat-avatar-wrap">
                      <img src={selectedParticipant.avatar} alt={selectedParticipant.name} className="chat-avatar" />
                      {selectedParticipant.online && <span className="chat-dot" />}
                    </div>
                    <div>
                      <div className="chat-conv-name-row">
                        <p className="chat-conv-name">{selectedParticipant.name}</p>
                        <span className={`chat-role-badge ${selectedParticipant.role}`}>
                          {ROLE_LABELS[selectedParticipant.role]}
                        </span>
                      </div>
                      <p className="chat-conv-status">{selectedParticipant.online ? 'В сети' : 'Не в сети'}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <GroupAvatarStack avatars={selectedThread.memberAvatars} name={selectedThread.groupName} />
                    <div>
                      <div className="chat-conv-name-row">
                        <p className="chat-conv-name">{selectedThread.groupName}</p>
                        {selectedThread.groupType && (
                          <span className={`chat-group-badge ${selectedThread.groupType}`}>
                            {GROUP_TYPE_LABELS[selectedThread.groupType]}
                          </span>
                        )}
                      </div>
                      <p className="chat-conv-status">
                        {(selectedThread.memberAvatars?.length ?? 0) + 1} участников
                      </p>
                    </div>
                  </>
                )}
              </div>
              <div className="chat-conv-actions">
                <button type="button" className="chat-action-btn" aria-label="Голосовой звонок" onClick={() => alert('Голосовые звонки появятся в следующей версии')}><Phone size={16} /></button>
                <button type="button" className="chat-action-btn video" aria-label="Видеозвонок" onClick={() => alert('Видеозвонки появятся в следующей версии')}><Video size={16} /></button>
                {selectedThread.kind === 'group' && (
                  <button
                    type="button"
                    className={showMembers ? 'chat-action-btn active' : 'chat-action-btn'}
                    aria-label="Участники"
                    onClick={() => setShowMembers((v) => !v)}
                  >
                    <Users size={16} />
                  </button>
                )}
                <button type="button" className="chat-action-btn" aria-label="Ещё"><MoreVertical size={16} /></button>
              </div>
            </div>

            <div className="chat-conv-body">
              {/* Members sidebar (groups only) */}
              {selectedThread.kind === 'group' && showMembers && (
                <aside className="chat-members-sidebar">
                  <h4>Участники</h4>
                  <ul>
                    <li className="chat-member-row">
                      <img src={ME.avatar} alt={ME.name} className="chat-member-avatar" />
                      <div>
                        <span className="chat-member-name">{ME.name} (вы)</span>
                        <span className={`chat-role-badge ${ME.role}`}>{ROLE_LABELS[ME.role]}</span>
                      </div>
                    </li>
                    {Object.values(participants).map((p) => (
                      <li key={p.id} className="chat-member-row">
                        <img src={p.avatar} alt={p.name} className="chat-member-avatar" />
                        <div>
                          <span className="chat-member-name">{p.name}</span>
                          <span className={`chat-role-badge ${p.role}`}>{ROLE_LABELS[p.role]}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </aside>
              )}

              {/* Messages */}
              <div className="chat-messages">
                <div className="chat-media-actions">
                  <button type="button" aria-label="Файл"><FileText size={16} /></button>
                  <button type="button" aria-label="Ссылка"><Link2 size={16} /></button>
                  <button type="button" aria-label="Голосовое"><Mic size={16} /></button>
                </div>

                <div className="chat-bubble-list">
                  {currentMessages.map((msg) => {
                    const senderAvatar = msg.own
                      ? ME.avatar
                      : (msg.senderAvatar ?? selectedParticipant?.avatar ?? '')
                    const senderName = msg.own
                      ? ME.name
                      : (msg.senderName ?? selectedParticipant?.name ?? '')
                    return (
                      <div key={msg.id} className={msg.own ? 'chat-bubble-row own' : 'chat-bubble-row'}>
                        {!msg.own && (
                          <img src={senderAvatar} alt={senderName} className="chat-bubble-avatar" />
                        )}
                        <div className="chat-bubble-wrap">
                          {!msg.own && selectedThread.kind === 'group' && msg.senderName && (
                            <span className="chat-bubble-sender">{msg.senderName}</span>
                          )}
                          <div className={msg.own ? 'chat-bubble own' : 'chat-bubble'}>
                            {msg.text.split('\n').map((line, i, arr) => (
                              <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                            ))}
                          </div>
                          <span className="chat-bubble-time">{msg.time}</span>
                        </div>
                        {msg.own && (
                          <img src={ME.avatar} alt={ME.name} className="chat-bubble-avatar" />
                        )}
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            </div>

            {/* Input bar */}
            <div className="chat-input-bar">
              <button type="button" className="chat-input-icon" aria-label="Emoji">
                <Smile size={18} />
              </button>
              <input
                className="chat-input"
                placeholder="Написать сообщение..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage()
                  }
                }}
                aria-label="Ввод сообщения"
              />
              <button type="button" className="chat-send-btn" onClick={sendMessage} aria-label="Отправить">
                <Send size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div className="chat-empty">
            <p>Выберите чат</p>
          </div>
        )}
      </div>

      {/* Create group modal */}
      {showCreateGroup && (
        <CreateGroupModal onClose={() => setShowCreateGroup(false)} onCreate={handleCreateGroup} />
      )}
    </>
  )

  if (variant === 'teacher') {
    return (
      <TeacherShellLayout
        language={language}
        onLanguageChange={onLanguageChange}
        title="Чат"
        activePage="t-chat"
      >
        {page}
      </TeacherShellLayout>
    )
  }

  if (variant === 'parent') {
    return (
      <ParentShellLayout
        language={language}
        onLanguageChange={onLanguageChange}
        title="Чат с учителем"
        subtitle="Переписка с учителями Анны"
        activePage="p-chat"
      >
        {page}
      </ParentShellLayout>
    )
  }

  return (
    <CourseShellLayout language={language} onLanguageChange={onLanguageChange} title="Чат" activePage="chat">
      {page}
    </CourseShellLayout>
  )
}

