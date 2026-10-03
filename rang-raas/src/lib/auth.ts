import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secretKey = process.env.JWT_SECRET || 'super-secret-rang-raas-key';
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  return payload;
}

export async function login(email: string, password: string) {
  // Simplified hardcoded admin for demonstration. 
  // Should ideally query the Admin model using bcrypt.
  if (email === 'admin@wcc.com' && password === 'admin123') {
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    // Include a stable UUID for the hardcoded admin
    const session = await encrypt({ user: { email, id: '11111111-1111-1111-1111-111111111111' } });
    
    const cookieStore = cookies();
    // Support both next14 (sync) and next15 (async)
    if (typeof (cookieStore as any).then === 'function') {
      const awaitedCookies = await (cookieStore as any);
      awaitedCookies.set('session', session, { expires, httpOnly: true });
    } else {
      (cookieStore as any).set('session', session, { expires, httpOnly: true });
    }
    
    return { success: true };
  }
  return { success: false, error: 'Invalid credentials' };
}

export async function logout() {
  const cookieStore = cookies();
  if (typeof (cookieStore as any).then === 'function') {
    const awaitedCookies = await (cookieStore as any);
    awaitedCookies.set('session', '', { expires: new Date(0) });
  } else {
    (cookieStore as any).set('session', '', { expires: new Date(0) });
  }
}

export async function getSession() {
  const cookieStore = cookies();
  let session;
  if (typeof (cookieStore as any).then === 'function') {
    const awaitedCookies = await (cookieStore as any);
    session = awaitedCookies.get('session')?.value;
  } else {
    session = (cookieStore as any).get('session')?.value;
  }
  
  if (!session) return null;
  try {
    return await decrypt(session);
  } catch(e) {
    return null;
  }
}
