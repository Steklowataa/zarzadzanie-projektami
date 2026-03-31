import { User } from "../types/user";

const admin: User = {
    id: "1",
    name: "John",
    email: "test@gmail.com",
    role: "admin"
}

const developer: User = {
    id: "2",
    name: "Jane",
    email: "test2@gmail.com",
    role: "developer"
}

const devops: User = {
    id: "3",
    name: "Bob",
    email: "test3@gmail.com",
    role: "devops"
}

export const users = [admin, developer, devops]

export const currentUser = admin