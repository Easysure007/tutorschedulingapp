export interface ServerConfigType {
    getJWTSecret: () => string;
}

export const ServerConfig: ServerConfigType = {
    getJWTSecret: (): string => process.env.JWT_SECRET || 'somedirtysecret',
}

