import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sgMail from '@sendgrid/mail';
import constants from '../common/constants/constants';

export class SendMailVerifyDto {
  to: string;
  token: string;
}

@Injectable()
export class EmailService {
  verificationEmailUrl: string;
  resetPasswordUrl: string;
  hostUrl: string;
  constructor(private readonly configService: ConfigService) {
    this.hostUrl = this.configService.get('host.url');
    this.verificationEmailUrl = `${this.hostUrl}/auth/verify-email?token=`;
    this.resetPasswordUrl = `${this.hostUrl}/v1/auth/reset-password?token=`;
  }
  /**
   * Send email to verify
   * @param to
   * send to the email
   * @param token
   * verify email token
   */
  sendVerificationEmail = async (sendMailVerifyDto: SendMailVerifyDto) => {
    try {
      const msg = {
        to: sendMailVerifyDto.to,
        from: this.configService.get('email.host'),
        subject: 'Please Verify Your Email',
        html: `<strong>Let's verify your email.</strong><br>
      ${sendMailVerifyDto.to}<br>
      <a>${this.verificationEmailUrl + sendMailVerifyDto.token}</a><br>
      Your link is active for ${this.configService.get(
        constants.JWT_VERIFY_EMAIL_EXPIRATION,
      )} minutes. After that, you will need to resend the verification email`,
      };
      await sgMail.send(msg);
    } catch (error) {
      throw new BadRequestException('Send mail verify failed');
    }
  };
  /**
   * Send email to verify reset password
   * @param to
   * send to the email
   * @param token
   * reset password token
   */
  sendResetPasswordEmail = async (sendMailVerifyDto: SendMailVerifyDto) => {
    try {
      const subject = 'Reset password';
      const resetPasswordUrl = this.resetPasswordUrl + sendMailVerifyDto.token;
      const html = `Dear ${sendMailVerifyDto.to}<br>,
To reset your password, click on this link: <a>${resetPasswordUrl}</a><br>
If you did not request any password resets, then ignore this email.`;

      const msg = {
        to: sendMailVerifyDto.to,
        from: this.configService.get('email.emailFrom'),
        subject,
        html,
      };
      await sgMail.send(msg);
    } catch (error) {
      throw new BadRequestException('Send mail reset password failed');
    }
  };
}
