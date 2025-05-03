import Mail from '@adonisjs/mail/services/main'
import Task from '#models/task'
import { inject } from '@adonisjs/core'
import env from "#start/env";

@inject()
export class TaskAssignmentEmailService {
  private mail = Mail
  public async sendTaskAssignmentEmail(task: Task, user: any) {
    try {
      await this.mail.send((message) => {
        message
          .to(user.email)
          .subject(`Nouvelle tâche assignée: ${task.name}`)
          .html(`
            <h1>Nouvelle tâche assignée</h1>
            <p>Bonjour ${user.fullName},</p>
            <p>Une nouvelle tâche vous a été assignée :</p>
            <h2>${task.name}</h2>
            <p>Description : ${task.description || 'Aucune description'}</p>
            <p>Date limite : ${task.dateFin ? task.dateFin.toLocaleString() : 'Non spécifiée'}</p>
            <a href="[URL_DE_VOTRE_APPLICATION]">Voir la tâche</a>
          `)
      })

      console.log(`E-mail envoyé à ${user.email} pour la tâche ${task.name}`)
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'e-mail:', error)
      throw error
    }
  }

  public async sendLateTaskEmail(task: Task, user: any) {
    try {
      const appBaseUrl = env.get('APP_BASE_URL', 'http://localhost:3333')
      const taskUrl = `${appBaseUrl}/tasks/${task.id}`

      await this.mail.send((message) => {
        message
          .to(user.email)
          .subject(`🕰️ Tâche en retard: ${task.name}`)
          .html(`
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #d32f2f;">Tâche en retard</h1>
              <p>Bonjour ${user.fullName},</p>
              <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
                <h2 style="color: #1976d2;">${task.name}</h2>
                <p><strong>Description :</strong> ${task.description || 'Aucune description'}</p>
                <p>Date limite dépassée : ${task.dateFin ? task.dateFin.toLocaleString() : 'Non spécifiée'}</p>
              </div>
              <p>Merci de compléter cette tâche dès que possible.</p>
              <a
                href="${taskUrl}"
                style="
                  display: inline-block;
                  background-color: #4CAF50;
                  color: white;
                  padding: 10px 20px;
                  text-decoration: none;
                  border-radius: 5px;
                "
              >
                Voir la tâche
              </a>
              <p style="color: #888; font-size: 0.8em; margin-top: 20px;">
                Si vous avez des questions, contactez votre gestionnaire.
              </p>
            </div>
          `)
      })

      console.log(`📧 Email envoyé à ${user.email} pour la tâche en retard : ${task.name}`)
    } catch (error) {
      console.error("❌ Erreur lors de l'envoi de l'e-mail :", error)
      throw error
    }
  }
}
