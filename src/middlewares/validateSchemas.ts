import { cardSchemas } from "../schema/cardSchemas";

export async function validateCreatCardSchema(cardInfo: { employeeId: number, type: string }) {
    
    cardInfo.employeeId = Number(cardInfo.employeeId); 
    const validation =  cardSchemas.createCardSchema.validate(cardInfo);
    
    if(validation.error) {
        throw {type: "bad_request", message: "Registration incorrectly done! Please try again!"};
    }
}


export async function validateSchemas(schema: any, requestInfo: any) {

    const validation = schema.validate(requestInfo);

    if(validation.error) {
        throw {type: "bad_request", message: "Registration incorrectly done! Please try again!"};
    }
}