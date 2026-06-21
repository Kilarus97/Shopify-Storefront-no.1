'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createCustomer, loginCustomer } from '@/lib/shopify/customer';
import { updateCustomer } from '@/lib/shopify/customer';

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

export async function updateProfile(formData: FormData) {
  const token = await getSession();
  if (!token) {
    return { success: false, errors: ['Not logged in'] };
  }

  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const phone = formData.get('phone') as string;

  const result = await updateCustomer(token, {
    firstName,
    lastName,
    phone: phone || undefined,
  });

  if (!result.success) {
    return { success: false, errors: result.errors };
  }

  revalidatePath('/account');
  return { success: true, errors: [] };
}

// Dodaj na postojeći fajl

export async function updateAddressAction(formData: FormData) {
  const token = await getSession();
  if (!token) {
    return { success: false, errors: ['Not logged in'] };
  }

  const addressId = formData.get('addressId') as string;
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const address1 = formData.get('address1') as string;
  const address2 = formData.get('address2') as string;
  const city = formData.get('city') as string;
  const province = formData.get('province') as string;
  const zip = formData.get('zip') as string;
  const country = formData.get('country') as string;
  const phone = formData.get('phone') as string;

  const { updateCustomerAddress } = await import('@/lib/shopify/customer');

  const result = await updateCustomerAddress(token, addressId, {
    firstName,
    lastName,
    address1,
    address2: address2 || undefined,
    city,
    province,
    zip,
    country,
    phone: phone || undefined,
  });

  if (!result.success) {
    return { success: false, errors: result.errors };
  }

  revalidatePath('/account');
  return { success: true, errors: [] };
}

export async function deleteAddressAction(formData: FormData) {
  const token = await getSession();
  if (!token) {
    return { success: false, errors: ['Not logged in'] };
  }

  const addressId = formData.get('addressId') as string;

  const { deleteCustomerAddress } = await import('@/lib/shopify/customer');

  const result = await deleteCustomerAddress(token, addressId);

  if (!result.success) {
    return { success: false, errors: result.errors };
  }

  revalidatePath('/account');
  return { success: true, errors: [] };
}

export async function setDefaultAddressAction(formData: FormData) {
  const token = await getSession();
  if (!token) {
    return { success: false, errors: ['Not logged in'] };
  }

  const addressId = formData.get('addressId') as string;

  const { setDefaultAddress } = await import('@/lib/shopify/customer');

  const result = await setDefaultAddress(token, addressId);

  if (!result.success) {
    return { success: false, errors: result.errors };
  }

  revalidatePath('/account');
  return { success: true, errors: [] };
}