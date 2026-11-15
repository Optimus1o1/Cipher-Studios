import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Lightweight HTTP health check endpoint for Render.
 * Configured in render.yaml and Render dashboard as: /api/health
 *
 * Requirements:
 * - Responds HTTP 200 reliably and instantly (< 5ms)
 * - Zero database or external network dependencies
 * - Zero secrets, environment variables, or stack traces exposed
 * - Publicly accessible without authentication
 */
export async function GET() {
  return NextResponse.json(
    {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    }
  );
}
