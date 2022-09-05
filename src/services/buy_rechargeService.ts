import { validateSchemas } from "../middlewares/validateSchemas";
import { validations } from "../middlewares/validations";
import { lookingForCard, lookingForTransactions } from "../repositories/companyRepository";
import { rechargeSchema, buyingSchema } from "../schema/buy_rechargeSchemas";
import dayjs from 'dayjs';
import { rechargingRepository, lookingForBusiness, insertBuying } from "../repositories/buy_rechargesRepository";


export async function rechargeCardService(key: string, rechargeInfo: { number: string, amount: number }) {

    rechargeInfo.amount = Number(rechargeInfo.amount);
    await validateSchemas(rechargeSchema, rechargeInfo);// Validating if the information was correctly send.

    await validations.companyValidation(key) // Validating if the company exists.

    const card = await lookingForCard(rechargeInfo.number); // Looking for the card.
    await validations.cardExist(card); // Validating it's existency.
    await validations.cardIsUsable(card); // Validating if card isn't blocked, isn't expired and is activated.

    const today = dayjs().format();

    await rechargingRepository(card.id, today, rechargeInfo.amount);

    return;
    
}

export async function buyingService(buyingInfo: { number: string, password: string, amount: number, businessName: string }) {

    buyingInfo.amount = Number(buyingInfo.amount);
    await validateSchemas(buyingSchema, buyingInfo); // Validating if the information was correctly send.

    const card = await lookingForCard(buyingInfo.number); // Looking for the card.
    await validations.cardExist(card); // Validating it's existency.
    await validations.cardIsUsable(card); // Validating if card isn't blocked, isn't expired and is activated. 
    await validations.passwordVerifying(buyingInfo.password, card.password); // Validating if the password is correct.
    
    const business = await lookingForBusiness(buyingInfo.businessName); // Looking for the business.
    const totalAmount = await lookingForTransactions(card.id);  // Getting the balance of the card using.
    await validations.businessVerify(business, card.type); // Validating if the business is the same type of the card, and if it exists.

    let balance: number = 0;
    
    totalAmount.transactions.map((object: { amount: number; }) => balance -= object.amount);
    totalAmount.recharges.map((object: { amount: number; }) => balance += object.amount);

    await validations.balanceVerify(buyingInfo.amount, balance); // Validating if the card has enough money to complete the buying.

    const today = dayjs().format();
    await insertBuying(card.id, business.id, today, buyingInfo.amount);

    return;
}