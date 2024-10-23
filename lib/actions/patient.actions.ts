"use server"

import { ID, Query } from "node-appwrite"
import { users } from "../appwrite.config"
import { parseStringify } from "../utils"

export const createUser = async (user: CreateUserParams) => {
    try {
        console.log(user, 'creating')
        console.log(users, 'users')
        const newUser = await users.create(ID.unique(), user.email, user.phone, undefined, user.name)
        console.log(newUser, 'new user')

        return parseStringify(newUser)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        if (error && error?.code === 409) {
            const existingUser = await users.list([Query.equal('email', [user.email])])

            return existingUser?.users[0]
        }

        console.error("An error occurred while creating a new user:", error);
    }
}

export const getUser = async (userId: string) => {
    try {
        const user = await users.get(userId)

        return parseStringify(user)
    } catch (error) {
        console.log(error)
    }
}
