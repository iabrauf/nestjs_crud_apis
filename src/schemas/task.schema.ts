import * as mongoose from "mongoose";

export const TaskSchema = new mongoose.Schema({
    username: String,
    task: String,
    completed: Boolean,
});