export const openapiDocument = {
    openapi: "3.0.3",
    info: {
        title: "EduFuture API",
        version: "1.0.0",
        description: "API документация платформы EduFuture",
    },
    servers: [{ url: "/api", description: "Current server" }],
    tags: [
        { name: "Health" },
        { name: "Auth" },
        { name: "Courses" },
        { name: "Student" },
        { name: "Tasks" },
        { name: "Tournaments" },
        { name: "Parent" },
        { name: "AI" },
        { name: "Chat" },
        { name: "Notifications" },
        { name: "Payments" },
    ],
    paths: {
        "/health": {
            get: {
                tags: ["Health"],
                summary: "Service health check",
                responses: {
                    "200": {
                        description: "Backend is healthy",
                    },
                },
            },
        },
        "/payments/plans": {
            get: {
                tags: ["Payments"],
                summary: "List subscription plans",
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": { description: "Plans list" },
                    "401": { description: "Unauthorized" },
                },
            },
        },
        "/payments/checkout/subscription": {
            post: {
                tags: ["Payments"],
                summary: "Start subscription checkout",
                security: [{ bearerAuth: [] }],
                responses: {
                    "201": { description: "Checkout URL created" },
                    "401": { description: "Unauthorized" },
                },
            },
        },
        "/payments/marketplace": {
            get: {
                tags: ["Payments"],
                summary: "List paid marketplace courses",
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": { description: "Marketplace list" },
                    "401": { description: "Unauthorized" },
                },
            },
        },
        "/payments/checkout/course/{courseId}": {
            post: {
                tags: ["Payments"],
                summary: "Start course purchase checkout",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "courseId",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                responses: {
                    "201": { description: "Checkout URL created" },
                    "401": { description: "Unauthorized" },
                },
            },
        },
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
    },
} as const;
