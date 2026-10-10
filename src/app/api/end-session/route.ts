import { end_session } from '@/lib/server/metrics';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { session_id } = body;

		if (!session_id) {
			return new Response(JSON.stringify({ error: 'Missing session_id' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		await end_session({ session_id });

		return new Response(null, { status: 204 });
	} catch (error) {
		console.error('Error ending session:', error);
		return new Response(JSON.stringify({ error: 'Failed to end session' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}
