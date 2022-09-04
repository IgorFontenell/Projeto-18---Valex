import { connection } from "../config/connection";


export async function companyExist(key: string) {
    
    const {rows: existingCompany} = await connection.query(`SELECT * FROM companies WHERE "apiKey" = ($1)`, [key])
    
    return existingCompany[0];
}

export async function employeeExist(employeeId: number){
    const {rows: employeeVerification } = await connection.query(`SELECT * FROM employees WHERE id = ($1)`, [employeeId]);
    
    return employeeVerification[0];
}

export async function employeeCards(employeeId: number){
    const {rows: employeeCards } = await connection.query(`SELECT * FROM cards WHERE "employeeId" = ($1)`, [employeeId]);
    
    return employeeCards;
}

export async function companyInsertCard(card: {
    employeeId: number,
    number: string,
    cardholderName: string,
    securityCode: string,
    expirationDate: string,
    isVirtual: boolean,
    isBlocked: boolean,
    type: string 
}) {
    
    await connection.query(`
    INSERT INTO cards (
        "employeeId",
        number,
        "cardholderName",
        "securityCode",
        "expirationDate",
        "isVirtual",
        "isBlocked",
        type) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [card.employeeId,
        card.number,
        card.cardholderName,
        card.securityCode,
        card.expirationDate,
        card.isVirtual,
        card.isBlocked,
        card.type]);

    
}