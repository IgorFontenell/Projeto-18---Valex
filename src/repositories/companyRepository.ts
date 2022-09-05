import { connection } from "../config/connection";


export async function companyExist(key: string) {
    try {
        const {rows: existingCompany} = await connection.query(`SELECT * FROM companies WHERE "apiKey" = ($1)`, [key])
    
        return existingCompany[0];
    } catch(err) {
        throw { trype: "server_error", message: `${err} Database with problems. Please try again!` }
    }
}

export async function employeeExist(employeeId: number){

    try {
        const {rows: employeeVerification } = await connection.query(`SELECT * FROM employees WHERE id = ($1)`, [employeeId]);
    
        return employeeVerification[0];
    } catch(err) {
        throw { trype: "server_error", message: `${err} Database with problems. Please try again!` }
    }
    
}

export async function employeeCards(employeeId: number){
    try {
        const {rows: employeeCards } = await connection.query(`SELECT * FROM cards WHERE "employeeId" = ($1)`, [employeeId]);
    
        return employeeCards;
    } catch(err) {
        throw { trype: "server_error", message: `${err} Database with problems. Please try again!` }
    }
    
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
    try {
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

    } catch(err) {
        throw { trype: "server_error", message: `${err} Database with problems. Please try again!` }
    }
    
   

}

export async function lookingForCard (number: string){
    try {
        const { rows: card } = await connection.query(`SELECT * FROM cards WHERE number = ($1)`, [number]);
        return card[0];
    } catch(err) {
        throw { trype: "server_error", message: `${err} Database with problems. Please try again!` }
    }
    
}

export async function insertPassword (number: string, password: string) {
    try {

        await connection.query(`
        UPDATE cards SET password = ($1) WHERE number = ($2)`, [password, number]);

        return;

    } catch(err) {
        throw { trype: "server_error", message: `${err} Database with problems. Please try again!` }
    }
   
}

export async function lookingForTransactions (cardId: number) {
    try {
        
        const { rows: recharges } = await connection.query(`
        SELECT * FROM recharges WHERE "cardId" = ($1)`, [cardId])

        const { rows: transactions } = await connection.query(`
        SELECT * FROM payments AS transactions WHERE "cardId" = ($1)`, [cardId]);

        const result = {
            transactions,
            recharges
        }
        
        
        return result;
    
    } catch(err) {
        
        throw { trype: "server_error", message: `${err} Database with problems. Please try again!` }
    }
    
}

export async function blockCardRepository(number: string){

    try {
        
        await connection.query(`
        UPDATE cards SET "isBlocked" = ($1) WHERE number = ($2)`, [true, number]);
        
        return ;
    } catch(err) {
        throw { trype: "server_error", message: `${err} Database with problems. Please try again!` }
    }
    
}

export async function unBlockCardRepository(number: string){

    try {
        await connection.query(`
        UPDATE cards SET "isBlocked" = ($1) WHERE number = ($2)`, [false, number]);
    
        return ;
    } catch(err) {
        throw { trype: "server_error", message: `${err} Database with problems. Please try again!` }
    }
    
}