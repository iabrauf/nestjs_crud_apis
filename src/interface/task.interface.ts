export interface Task {
    id?: string,
    name: string,
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