/**
 * AI Chat API with Usage Limits
 * Handles AI chat requests with daily usage limits for guests
 */

import { NextRequest, NextResponse } from 'next/server';
import { isFeatureEnabled, assertEntityEnabled } from '@/lib/featureGate';
import { checkAIUsageLimit, incrementAIUsage, createAILimitResponse } from '@/lib/aiUsage';
import { isAiAvailable } from '@/lib/ai';
import { log } from '@/lib/log';

export async function POST(request: NextRequest) {
  try {
    // Check if AI feature is enabled
    if (!(await isFeatureEnabled('ai'))) {
      return Response.json(
        { ok: false, error: 'AI features are currently disabled' },
        { status: 503 }
      );
    }

    // Check if AI service is available
    if (!isAiAvailable()) {
      return Response.json(
        { ok: false, error: 'AI service is currently unavailable' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { userId, message, entityData } = body;

    if (!userId || !message) {
      return Response.json(
        { ok: false, error: 'User ID and message are required' },
        { status: 400 }
      );
    }

    // Check if entity is suspended (optional entity data)
    if (entityData) {
      try {
        assertEntityEnabled(entityData);
      } catch (error: any) {
        if (error.cause?.code === 'ENTITY_SUSPENDED') {
          return Response.json(
            { 
              ok: false, 
              error: 'Account is suspended', 
              code: 'ENTITY_SUSPENDED',
              notes: error.cause.notes 
            },
            { status: 403 }
          );
        }
      }
    }

    // Check AI usage limits for guests
    const usageCheck = await checkAIUsageLimit(userId);
    if (!usageCheck.allowed) {
      return createAILimitResponse(usageCheck.remaining, usageCheck.limit);
    }

    // Process AI request (simplified - would integrate with actual AI flows)
    try {
      // This is where you'd call your genkit flows or AI service
      // For now, we'll simulate a response
      const aiResponse = await processAIMessage(message);

      // Increment usage count after successful AI response
      await incrementAIUsage(userId);

      // Log the AI interaction
      await log('ai_chat_interaction', {
        userId,
        messageLength: message.length,
        responseLength: aiResponse.length,
        usageRemaining: usageCheck.remaining - 1,
        ip: request.headers.get('x-forwarded-for') || 'unknown'
      });

      return Response.json({
        ok: true,
        response: aiResponse,
        usage: {
          used: usageCheck.limit - usageCheck.remaining + 1,
          remaining: usageCheck.remaining - 1,
          limit: usageCheck.limit
        }
      });

    } catch (aiError) {
      console.error('AI processing failed:', aiError);
      
      await log('ai_chat_error', {
        userId,
        error: String(aiError),
        messageLength: message.length
      });

      return Response.json(
        { ok: false, error: 'AI processing failed' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('AI chat endpoint failed:', error);
    
    await log('ai_chat_endpoint_error', {
      error: String(error),
      stack: error instanceof Error ? error.stack : undefined
    });

    return Response.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Process AI message - placeholder for actual AI integration
 * In a real implementation, this would call your genkit flows
 */
async function processAIMessage(message: string): Promise<string> {
  // Simulate AI processing time
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simple response based on message content
  if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
    return "Hello! I'm Rebecca, your EventSafe assistant. How can I help you today?";
  }
  
  if (message.toLowerCase().includes('event') || message.toLowerCase().includes('ticket')) {
    return "I can help you with event-related questions. What would you like to know about events or tickets?";
  }
  
  if (message.toLowerCase().includes('help')) {
    return "I'm here to help! You can ask me about events, tickets, venues, or general EventSafe questions.";
  }
  
  return "Thanks for your message! I'm currently learning to better assist with EventSafe-related questions. Is there something specific about events or tickets I can help with?";
}