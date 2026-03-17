import Action from "../models/Action";

export class ActionService {

    private actions = [
        { Action: 'EDIT' },
        { Action: 'VIEW' },
        { Action: 'DELETE' },
        { Action: 'PRINT' },
    ];

    async seedAction() {
        const existingAction = await Action.find({
            Action: { $in: this.actions.map(action => action.Action) }
        });
    
        const existingActionName = new Set(existingAction.map(action =>  action.Action));
    
        const newAction = this.actions.filter(action => !existingActionName.has( action.Action));
    
        if (newAction.length > 0) {
            await Action.insertMany(newAction);
        }
    }
    

}