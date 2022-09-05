import { connection } from "../config/connection";


export async function rechargingRepository(cardId: number, timestamp: string, amount: number) {
    try {
        await connection.query(`
        INSERT INTO recharges 
        ("cardId", timestamp, amount) 
        VALUES ($1, $2, $3)`, [cardId, timestamp, amount]);
    
        return ;
    } catch(err) {
        throw { trype: "server_error", message: `${err} Database with problems. Please try again!` }
    }
}

export async function lookingForBusiness(businessName: string) {
    try {
        const { rows: business } = await connection.query(`
        SELECT * FROM businesses WHERE name = ($1)`, [businessName]);
    
        return business[0];
    } catch(err) {
        throw { trype: "server_error", message: `${err} Database with problems. Please try again!` }
    }
}

export async function insertBuying(cardId: number, businessId: number, timestamp: string, amount: number) {
    try {
        await connection.query(`
        INSERT INTO payments 
        ("cardId", "businessId", timestamp, amount) 
        VALUES ($1, $2, $3, $4)`, [cardId, businessId, timestamp, amount]);
    
        return ;
    } catch(err) {
        throw { trype: "server_error", message: `${err} Database with problems. Please try again!` }
    }
}

