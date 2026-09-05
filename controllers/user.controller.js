import { changePasswordService, getUsersService } from "../services/user.service.js";

export async function getUsers(req,res) {
    const result = await getUsersService();

    return res.status(200).json(result)
    
}

export async function changePassword(req, res) {
    const userId = req.user.id;

    const { currentPassword, newPassword } = req.body;

    await changePasswordService(userId,currentPassword,newPassword);

    res.status(200).json({
        success: true,
        message: "Password changed successfully"
    })
}