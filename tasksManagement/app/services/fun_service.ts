import { randomBytes } from 'crypto';
import axios from "axios";
import env from "#start/env";
import {createHash} from "node:crypto";
// @ts-ignore
import uniqid from 'uniqid';
import {inject} from "@adonisjs/core";
@inject()
export class FunService {
  sha256Hash(input: string): string {
    return createHash('sha256').update(input).digest('hex');
  }

  /**
   * Generate a random numeric string of the given length using a cryptographically secure method.
   * @param len The length of the numeric string.
   * @returns A string of random numeric characters.
   */
  randomNumeric(len: number): string {
    const digits = '0123456789';
    const bytes = randomBytes(len); // Generate secure random bytes
    let result = '';

    for (let i = 0; i < len; i++) {
      const index = bytes[i] % digits.length; // Map the byte to an index in the digits array
      result += digits[index];
    }

    return result;
  }

  /**
   * Generate a random alphanumeric string of the given length using a cryptographically secure method.
   * @param len The length of the string.
   * @returns A string of random alphanumeric characters.
   */
  randomString(len: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const bytes = randomBytes(len); // Generate secure random bytes
    let result = '';

    for (let i = 0; i < len; i++) {
      const index = bytes[i] % chars.length; // Map the byte to an index in the chars array
      result += chars[index];
    }

    return result;
  }

  async sendOtpBySms(phone: string, otp: string) {

    try {
      const response = await axios.post(
     'https://gateway.intechsms.sn/api/send-sms'
    ,
        {
          app_key: env.get("INTECH_SMS_API_KEY"),
          sender: 'Gestion des Taches',
          msisdn: [
            phone
          ],
          content: `Votre code OTP est : ${otp}. Ce code expire dans 10 minutes.`,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'OTP par SMS :", error.message);
      throw new Error("Impossible d'envoyer l'OTP par SMS.");
    }
  }


  async sendUrlBySms(phone: string, content: string) {
    try {
      console.log(`Tentative d'envoi de SMS à ${phone} avec le message : ${content}`);

      const response = await axios.post(
        'https://gateway.intechsms.sn/api/send-sms',
        {
          app_key: env.get("INTECH_SMS_API_KEY"),
          sender: 'INTECH',
          msisdn: [phone],
          content: content,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      console.log(`Réponse de l'API SMS:`, response.data);
      return response.data;
    } catch (error: any) {
      console.error("Erreur lors de l'envoi du SMS :", error?.response?.data || error.message);
      throw new Error("Impossible d'envoyer le SMS.");
    }
  }



  uniqueId(): string {
    return uniqid();
  }
}
