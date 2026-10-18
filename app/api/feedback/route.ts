import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { message, email, type } = await req.json();

  if (!message?.trim()) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 });
  }

  const apiKey = process.env.BREVO_API_KEY;
  const toEmail = process.env.FEEDBACK_TO_EMAIL;
  const fromEmail = process.env.FEEDBACK_FROM_EMAIL ?? 'feedback@spcmdc.com';
  const fromName = 'StatSPC Feedback';

  if (!apiKey || !toEmail) {
    console.error('Feedback env vars not set (BREVO_API_KEY, FEEDBACK_TO_EMAIL)');
    return NextResponse.json({ error: 'Feedback not configured' }, { status: 503 });
  }

  const htmlContent = `
    <p><strong>Type:</strong> ${type ?? 'General'}</p>
    <p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>
    ${email ? `<p><strong>Reply to:</strong> ${email}</p>` : '<p><em>No reply address given.</em></p>'}
  `;

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      sender: { name: fromName, email: fromEmail },
      to: [{ email: toEmail }],
      ...(email ? { replyTo: { email } } : {}),
      subject: `[StatSPC] ${type ?? 'Feedback'}`,
      htmlContent,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error('Brevo error', res.status, body);
    return NextResponse.json({ error: 'Failed to send — please try again.' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
