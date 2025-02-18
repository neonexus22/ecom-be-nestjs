import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class EmailService {
  constructor(@InjectQueue('email-queue') private readonly emailQueue: Queue) {}

  async sendEmail(to: string, subject: string, body: string) {
    console.log('reached sendemail');
    await this.emailQueue.add('send-email', { to, subject, body });
  }
}
