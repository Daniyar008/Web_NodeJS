export type DetailTab = 'overview' | 'faq' | 'discussion' | 'reviews'

export const detailCourse = {
    title: 'Introduction Figma Basic to Advance.',
    subtitle: 'Introduction Digital Marketing Basic to Advance.',
    teacher: 'William Joe',
    category: 'Figma',
    durationLabel: '03:14 / 1:00:00',
    heroImage: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1400&q=80',
}

export const moduleList = [
    {
        title: 'Module 1',
        subtitle: 'Introduction',
        lessons: 21,
        minutes: 54,
        active: false,
    },
    {
        title: 'Module 2',
        subtitle: 'Introduction',
        lessons: 21,
        minutes: 54,
        active: true,
        children: [
            { title: 'Getting started lessons', meta: '1 Video | 20 min' },
            { title: 'Overview about basic tools', meta: '1 Video | 30 min' },
            { title: 'Visual design using tools', meta: '1 Video | 40 min' },
        ],
    },
    {
        title: 'Module 3',
        subtitle: 'Introduction',
        lessons: 21,
        minutes: 54,
        active: false,
    },
    {
        title: 'Module 4',
        subtitle: 'Introduction',
        lessons: 21,
        minutes: 54,
        active: false,
    },
    {
        title: 'Module 5',
        subtitle: 'Introduction',
        lessons: 21,
        minutes: 54,
        active: false,
    },
    {
        title: 'Module 6',
        subtitle: 'Introduction',
        lessons: 21,
        minutes: 54,
        active: false,
    },
    {
        title: 'Module 7',
        subtitle: 'Introduction',
        lessons: 21,
        minutes: 54,
        active: false,
    },
]

export const overviewData = {
    description:
        'Progressively synthesize clicks-and-mortar infrastructures for impactful quality vectors. Seamlessly innovate corporate best practices via standardized models. Intrinsically grow sustainable relationships with world-class partnerships.',
    outcomes: [
        '15 lectures and 5.5 hours of content',
        'Live project end to end software',
        'All about Figma',
        'Basics designing in Figma',
        'Wire Frame, UX-UI design',
        'Design mobile and desktop apps',
    ],
    audience:
        'Credibly recapitalize parallel sources and visionary mindshare. Conveniently fabricate out-of-the-box functionalities via excellent core competencies.',
}

export const faqItems = [
    {
        title: '01. Marketing Introduction',
        answer:
            'Progressively synthesize clicks-and-mortar infrastructures for impactful quality vectors. Seamlessly innovate corporate best practices via standardized models.',
        expanded: true,
    },
    { title: 'Marketing tools', answer: '', expanded: false },
    { title: 'Digital Marketing', answer: '', expanded: false },
    { title: 'How to marketing for my website?', answer: '', expanded: false },
    { title: 'Marketing Tools', answer: '', expanded: false },
]

export const discussionItems = [
    {
        id: 'd1',
        author: 'John Doe',
        roleMeta: 'Student | 2h ago',
        avatar: 'https://i.pravatar.cc/80?img=61',
        body:
            'Compellingly aggregate revolutionary functionalities for customized methods of empowerment. Competently coordinate resource-sucking methods of empowerment with clicks-and-mortar relationships.',
    },
    {
        id: 'd2',
        author: 'John Doe',
        roleMeta: 'Student | 2h ago',
        avatar: 'https://i.pravatar.cc/80?img=62',
        body:
            'Assertively repurpose cross-platform relationships rather than diverse content and best practices. This lesson structure is very clear and practical.',
    },
]

export const reviewData = {
    average: 4.3,
    breakdown: [
        { stars: 5, percent: 57 },
        { stars: 4, percent: 26 },
        { stars: 3, percent: 12 },
        { stars: 2, percent: 3 },
        { stars: 1, percent: 2 },
    ],
    featured: {
        name: 'Kenny White',
        avatar: 'https://i.pravatar.cc/80?img=52',
        rating: 5,
        text: 'This online Figma course is the best solution for me. It is concise, practical and project-oriented.',
    },
}
