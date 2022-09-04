import { cardSchemas } from "../schema/creatCardSchema";

export async function validateCreatCardSchema(cardInfo: { employeeId: number, type: string }) {
    
    cardInfo.employeeId = Number(cardInfo.employeeId);
    const validation =  cardSchemas.createCardSchema.validate(cardInfo);
    
    if(validation.error) {
        throw {type: "bad_request", message: "Registration incorrectly done! Please try again!"};
    }
}

export async function validateActivateCardSchema(activateInfo: { number: string, securityNumber: string, password: string }) {
    
    const validation =  cardSchemas.activateCardSchema.validate(activateInfo);
   
    if(validation.error) {
        throw {type: "bad_request", message: "Registration incorrectly done! Please try again!"};
    }
} 