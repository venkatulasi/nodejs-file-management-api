import { getUsersRepository } from "../repositories/user.respository.js";

export async function getUsersService() {
    const users = await getUsersRepository();

    return {
        success: true,
        users
    }
}