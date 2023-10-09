export interface Task {
    id?: string,
    username: string,
    task: string,
    completed: boolean
}

export interface Delete {
    acknowledged: boolean,
    deletedCount: number
}

export interface Message {
    success: boolean;
    message: string;
}

