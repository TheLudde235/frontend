export interface Estate {
    estateuuid: string;
    adminuuid: string;
    city: string;
    street: string;
    description?: string;
    streetnumber: string;
}

export interface Token {
    uuid: string;
    email: string;
    username: string;
    admin: boolean;
    estates: Estate[];
    iat: number;
    exp: number;
}

export interface Task {
    taskuuid: string;
    title: string;
    description: string;
    estateuuid: string;
    completed: boolean;
    taskmaster?: string;
    priority: Priority;
    deadline: Date;
    open: boolean;
}

export interface Comment {
    commentuuid: string;
    taskuuid: string;
    text: string;
    admin: boolean;
    useruuid: string;
}

export interface Worker {
    workeruuid?: string;
    email: string;
    firstname: string;
    lastname: string;
    phone: string;
    skills?: string;
    image?: string;
}

export type Priority = 0 | 32 | 64 | 96 | 128 | 160 | 192 | 224 | 256