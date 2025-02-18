import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor('email-queue')
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor() {
    this.logger.debug('EmailProcessor initialized');
  }

  @Process('send-email')
  async handleSendEmail(
    job: Job<{ to: string; subject: string; body: string }>,
  ) {
    console.log('reached handleSendEmail');
    this.logger.debug('Sending email...');
    this.logger.debug(`To: ${job.data.to}`);
    this.logger.debug(`Subject: ${job.data.subject}`);
    this.logger.debug(`Body: ${job.data.body}`);

    //Simulate email sending
    await new Promise((resolve) => setTimeout(resolve, 5000));
    this.logger.debug('Email sent successfully');
  }
}
