export type CourseItem = {
    id: string
    title: string
    teacherName: string
    teacherAvatar: string
    lessons: number
    hours: number
    progress: number
    coverUrl: string
}

export const courseCatalogData: CourseItem[] = [
    {
        id: 'c1',
        title: 'History of graphic design',
        teacherName: 'William Joe',
        teacherAvatar: 'https://i.pravatar.cc/80?img=15',
        lessons: 15,
        hours: 40,
        progress: 100,
        coverUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80',
    },
    {
        id: 'c2',
        title: 'Graphic Design',
        teacherName: 'William Joe',
        teacherAvatar: 'https://i.pravatar.cc/80?img=32',
        lessons: 15,
        hours: 40,
        progress: 100,
        coverUrl: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=900&q=80',
    },
    {
        id: 'c3',
        title: 'Digital Painting',
        teacherName: 'William Joe',
        teacherAvatar: 'https://i.pravatar.cc/80?img=12',
        lessons: 15,
        hours: 40,
        progress: 100,
        coverUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80',
    },
    {
        id: 'c4',
        title: 'Design Thinking',
        teacherName: 'William Joe',
        teacherAvatar: 'https://i.pravatar.cc/80?img=22',
        lessons: 15,
        hours: 40,
        progress: 25,
        coverUrl: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=900&q=80',
    },
    {
        id: 'c5',
        title: 'App Design Course',
        teacherName: 'William Joe',
        teacherAvatar: 'https://i.pravatar.cc/80?img=19',
        lessons: 15,
        hours: 40,
        progress: 74,
        coverUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
    },
    {
        id: 'c6',
        title: 'Sketch in mobile Design',
        teacherName: 'William Joe',
        teacherAvatar: 'https://i.pravatar.cc/80?img=8',
        lessons: 15,
        hours: 40,
        progress: 60,
        coverUrl: 'https://images.unsplash.com/photo-1545239351-ef35f43d514b?auto=format&fit=crop&w=900&q=80',
    },
    {
        id: 'c7',
        title: 'Sketching for Designers',
        teacherName: 'William Joe',
        teacherAvatar: 'https://i.pravatar.cc/80?img=45',
        lessons: 15,
        hours: 40,
        progress: 34,
        coverUrl: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=900&q=80',
    },
    {
        id: 'c8',
        title: 'Sketching for Designers',
        teacherName: 'William Joe',
        teacherAvatar: 'https://i.pravatar.cc/80?img=26',
        lessons: 15,
        hours: 40,
        progress: 25,
        coverUrl: 'https://images.unsplash.com/photo-1474631245212-32dc3c8310c6?auto=format&fit=crop&w=900&q=80',
    },
]
