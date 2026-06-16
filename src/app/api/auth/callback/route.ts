import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const code = searchParams.get('code');
  const shop = searchParams.get('shop');
  const state = searchParams.get('state');

  if (!code || !shop) {
    return NextResponse.json({ error: 'Missing code or shop' }, { status: 400 });
  }

  // Zameni code za permanentni offline token
  const response = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.SHOPIFY_ADMIN_CLIENT_ID,
      client_secret: process.env.SHOPIFY_ADMIN_CLIENT_SECRET,
      code,
    }),
  });

  const data = await response.json();

  console.log('✅ ACCESS TOKEN:', data.access_token);
  console.log('📋 Scope:', data.scope);
  console.log('📋 Client ID korišćen:', process.env.SHOPIFY_ADMIN_CLIENT_ID);

  // Token se ispisuje u konzoli - kopiraj ga u .env.local
  return NextResponse.json({
    success: true,
    access_token: data.access_token,
    scope: data.scope,
  });
}
1