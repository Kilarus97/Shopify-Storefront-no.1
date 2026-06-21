import { Resend } from 'resend';
import { RESEND_API_KEY } from '@/lib/constants';

export const resend = new Resend(RESEND_API_KEY);