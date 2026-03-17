import { Request, Response, NextFunction } from "express";

import { ACTIONS, ROLE_PERMISSION, USER_TYPE } from "../utils/constants";
import { CustomRequest } from "../types/common";


export const checkPermission = (
    role: keyof typeof ROLE_PERMISSION,
    action: keyof typeof ACTIONS
  ) => {
    return (req: CustomRequest, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return; // ✅ Ensures function returns void
      }
  
      if (req.user.user_type === USER_TYPE.SUPER_ADMIN) {
        return next();
      }
  
      console.log("User Roles:", JSON.stringify(req.user.roleName, null, 2)); // Debugging
    console.log("Checking Role:", role);
    console.log("Checking Action:", action);

    const hasPermission = req.user.roleName.some((r) => {
      console.log("Checking RoleName:", r.role_Name);
      console.log("Checking Actions:", r.actions);

      // Flatten the nested array before checking
      const flattenedActions = r.actions.flat();

      return r.role_Name === role && flattenedActions.includes(action);
    });

    console.log("Has Permission:", hasPermission);

      
  
      if (!hasPermission) {
        res.status(403).json({ message: "Forbidden: Insufficient Permissions" });
        return; // ✅ Ensures function returns void
      }
  
      next(); // ✅ Ensures function returns void
    };
  };
