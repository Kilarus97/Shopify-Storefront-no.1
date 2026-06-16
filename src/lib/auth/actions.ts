'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createCustomer, loginCustomer } from '@/lib/shopify/customer';

const SESSION_COOKIE = 'customer_token';

export async function registerAction(formData: FormData) {
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const result = await createCustomer(email, password, firstName, lastName);

  if (!result.success) {
    return { success: false, errors: result.errors };
  }

  // Auto-login
  const loginResult = await loginCustomer(email, password);
  if (loginResult.success && loginResult.token) {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, loginResult.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    redirect('/account');
  }

  redirect('/account/login');
}

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const result = await loginCustomer(email, password);

  if (!result.success) {
    return { success: false, errors: result.errors.length > 0 ? result.errors : ['Invalid email or password'] };
  }

  if (result.token) {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    redirect('/account');
  }

  return { success: false, errors: ['Login failed'] };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    const { logoutCustomer } = await import('@/lib/shopify/customer');
    await logoutCustomer(token);
  }

  cookieStore.delete(SESSION_COOKIE);
  redirect('/account/login');
}

export async function getSession(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value || null;
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}