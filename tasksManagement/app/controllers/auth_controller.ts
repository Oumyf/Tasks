import {
  loginMessagesProvider,
  loginPostValidator,
  registerMessagesProvider,
  registerPostValidator,
} from '#validators/auth';
import { HttpContext } from '@adonisjs/core/http';
import User from '#models/user';
import Otp from '#models/otp';
import { DateTime } from 'luxon';
import {FunService} from "#services/fun_service";
import {inject} from "@adonisjs/core";


@inject()
export default class AuthController {
  constructor(protected funService: FunService) {
  }
  
  /**
   * Méthode d'inscription basique
   */
  async register({ request }: HttpContext) {
    const data = request.all()
    const validationResult = await registerPostValidator.validate(data, {
      messagesProvider: registerMessagesProvider,
    })

    const user = new User()

    await user.fill(validationResult).save()

    return {
      message: 'User registered',
      user,
    }
  }

  /**
   * Méthode d'inscription avec génération de token d'accès
   * Ce token pourra être utilisé pour le champ createdBy dans les tâches
   */
  async registerWithToken({ request, response }: HttpContext) {
    try {
      const data = request.all();
      const validationResult = await registerPostValidator.validate(data, {
        messagesProvider: registerMessagesProvider,
      });

      const user = new User();
      await user.fill(validationResult).save();

      // Générer directement un token d'accès pour l'utilisateur
      const authToken = await User.accessTokens.create(user, ['*'], {
        expiresIn: '30 days' // Durée de validité plus longue pour l'utilisation dans les tâches
      });

      return {
        status: 'success',
        message: 'User registered successfully',
        user,
        token: authToken
      };
    } catch (error) {
      return response.status(400).json({
        status: 'error',
        message: 'Registration failed',
        error: error.message,
      });
    }
  }
  
  async createUser({ request }: HttpContext) {
    const data = request.all();
    const validationResult = await registerPostValidator.validate(data, {
      messagesProvider: registerMessagesProvider,
    });

    const user = new User();
    await user.fill(validationResult).save();

    return {
      message: 'User created',
      user,
    };
  }

  async me({ auth }: HttpContext) {
    return {
      message: 'User info',
      user: auth.user,
    };
  }

  // Envoi par SMS de l'OTP
  async login({ request, response }: HttpContext) {
    const data = request.all();
    const validationResult = await loginPostValidator.validate(data, {
      messagesProvider: loginMessagesProvider,
    });

    const { email, password } = validationResult;
    let user: User;
    try {
     user = await User.verifyCredentials(email, password)
    } catch (e) {
      return response.status(403).json({
        status: 'bad_credentials',
        message: 'Invalid credentials',
      });
    }

    const otp =  await Otp.create({
      userId: user.id,
      otp: this.funService.randomNumeric(5),
      expiresAt: DateTime.now().plus({ minutes: 10 }), // Expiration dans 10 minutes
      attemptsLeft: 3,
      token: this.funService.randomString(30)
    });

     this.funService.sendOtpBySms(user.phone, otp.otp).then();

    return {
      status: 'success',
      message: 'OTP sent via SMS.',
      token: otp.token,
    };
  }

  /**
   * Méthode de login direct avec token sans OTP
   * Utile pour les applications qui n'ont pas besoin de double authentification
   */
  async loginWithToken({ request, response }: HttpContext) {
    const data = request.all();
    const validationResult = await loginPostValidator.validate(data, {
      messagesProvider: loginMessagesProvider,
    });

    const { email, password } = validationResult;
    let user: User;
    
    try {
      user = await User.verifyCredentials(email, password);
    } catch (e) {
      return response.status(403).json({
        status: 'bad_credentials',
        message: 'Invalid credentials',
      });
    }

    // Générer directement un token d'accès sans passer par l'OTP
    const authToken = await User.accessTokens.create(user, ['*'], {
      expiresIn: '30 days'
    });

    return response.status(200).json({
      status: 'success',
      message: 'Login successful',
      user,
      token: authToken
    });
  }

  async confirmLogin({ request, response }: HttpContext) {
    const { otp, token } = request.all();

    const otpRecord = await Otp.query()
      .where('token', token)
      .first();

    if (!otpRecord) {
      return response.status(403).json({
        status: 'bad_opt',
        message: 'Le OTP/Token ne correspond pas a un enregistrement valide ',
      });
    }

    if (otpRecord.otp !== otp) {
      otpRecord.attemptsLeft -= 1;
      await otpRecord.save();

      return response.status(403).json({
        status: 'bad_opt',
        message: 'Le OTP/Token ne correspond pas a un enregistrement valide',
      });
    }

    if (otpRecord.isUsed) {
      return response.status(403).json({
        status: 'bad_opt',
        message: 'Le OTP/Token est déja utilisé veuillez recommancer la connexion',
      });
    }

    if (otpRecord.attemptsLeft <= 0) {
      return response.status(403).json({
        status: 'bad_opt',
        message: 'Vous avez depassé le nombre de tentative autorisé pouir ce  OTP/Token, veuillez recommancer la connexion',
      });
    }

    if (DateTime.now() >  otpRecord.expiresAt) {
      return response.status(403).json({
        status: 'bad_opt',
        message: 'Le OTP/Token a expiré veuillez recommancer la connexion',
      });
    }

    otpRecord.isUsed = true;
   await otpRecord.save();

    const user = await User.find(otpRecord.userId);
    const autToken = await User.accessTokens.create(user!,  ['*'],
      {
        expiresIn: '30 minutes'
      })

    return response.status(200).json({
      status: 'success',
      user,
      token: autToken
    })
  }
}