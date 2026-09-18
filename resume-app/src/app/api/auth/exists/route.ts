import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { isMockEnvironment } from '@/lib/env';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = body.email;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: { message: 'Email is required' } },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check mock mode fallback
    if (isMockEnvironment()) {
      const cookieStore = await cookies();
      const mockRegisteredCookie = cookieStore.get('mock-registered-emails');
      let exists = false;
      if (mockRegisteredCookie?.value) {
        try {
          const list = JSON.parse(mockRegisteredCookie.value);
          exists = Array.isArray(list) && list.includes(normalizedEmail);
        } catch {}
      }
      return NextResponse.json({ success: true, exists });
    }

    // Production mode - query Supabase profiles
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (error) {
      console.error('[AUTH_CHECK] Error checking email existence:', error.message);
      return NextResponse.json(
        { success: false, error: { message: 'Failed to verify account' } },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      exists: !!data,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { message: err.message || 'Internal server error' } },
      { status: 500 }
    );
  }
}
