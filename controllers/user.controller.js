import { getUsersService } from "../services/user.service.js";

export async function getUsers(req,res) {
    const result = await getUsersService();

    return res.status(200).json(result)
    
}