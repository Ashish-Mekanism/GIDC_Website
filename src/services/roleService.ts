import Role from "../models/Roles";

export class RoleService {

    private roles = [
        { role_Name: 'CMS' },
        { role_Name: 'PHOTO_GALLERY' },
        { role_Name: 'COMPLAINT' },
    ];

    async seedRoles() {
        const existingRoles = await Role.find({
            role_Name: { $in: this.roles.map(role => role.role_Name) }
        });
    
        const existingRoleNames = new Set(existingRoles.map(role => role.role_Name));
    
        const newRoles = this.roles.filter(role => !existingRoleNames.has(role.role_Name));
    
        if (newRoles.length > 0) {
            await Role.insertMany(newRoles);
        }
    }
    

}