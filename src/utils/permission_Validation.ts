
import Role from '@/models/user/Role.model';
import Permission from '@/models/user/Permission.model';

export const hasPermission = async (role, permissionKey: string) => {

    if (!role || !role._id || !permissionKey) {
        console.error("Invalid arguments: Role object with _id and a permissionKey are required.");
        return false;
    }

    try {

        const permission:any = await Permission.findOne({ key: permissionKey }).lean();

        if (!permission) {
            return false;
        }
        const roleHasPermission = await Role.exists({
            _id: role._id,
            permissions: permission._id
        });

        return !!roleHasPermission;

    } catch (error) {
        console.error("Error during permission check:", error);
        throw new Error("An error occurred while validating permission.");
    }
};

