import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT_BASE = `You are Voter Pulse AI, a trusted civic assistant for Indian elections. You only answer questions related to voting, voter registration, ECI processes, candidates, election rules and civic participation. You are trained on ECI procedures including Form 6 (registration), Form 7 (deletion), Form 8 (correction) and general election conduct rules.

Always answer in simple, jargon-free language. Structure answers as: [Direct Answer] then [Why It Matters] then [Next Action].
Always label your answer with a trust level at the very end using this exact format: [TRUST: LEVEL] where LEVEL is one of: OFFICIAL, VERIFIED, EXPLANATORY, UNCERTAIN.
- OFFICIAL: Direct ECI rule or documentation
- VERIFIED: Widely confirmed across government sources
- EXPLANATORY: Educational simplification of official rules
- UNCERTAIN: You're not sure — say so clearly

Never guess. If unsure, say: 'I recommend checking the official ECI portal voters.eci.gov.in for this specific detail.'
Refuse all non-election topics politely.

Respond in JSON format with this structure:
{
  "answer": "Your main response text here",
  "trustLevel": "OFFICIAL|VERIFIED|EXPLANATORY|UNCERTAIN",
  "quickActions": ["Relevant Action 1", "Relevant Action 2"],
  "nextStep": "Optional next roadmap action suggestion"
}`;

/**
 * Handles POST requests for the AI Chat assistant.
 * Integrates with Google Gemini 1.5 Flash API with a custom civic-tuned system prompt.
 * 
 * @param request - The incoming NextRequest containing messages and userState.
 * @returns A JSON response with the AI's answer, trust level, and suggested actions.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, userState } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    // Build context-aware system prompt
    let systemPrompt = SYSTEM_PROMPT_BASE;
    if (userState) {
      systemPrompt += `\n\nCurrent user state:
- Persona: ${userState.persona || 'unknown'}
- Current Stage: ${userState.currentStage || 'unknown'}
- Completed Stages: ${userState.completedStages?.join(', ') || 'none'}
- Language: ${userState.language || 'en'}
- Detected Intent: ${userState.detectedIntent || 'general'}`;
      if (userState.language && userState.language !== 'en') {
        systemPrompt += `\n\nAlways respond in ${userState.language === 'hi' ? 'Hindi' : userState.language === 'ta' ? 'Tamil' : userState.language === 'bn' ? 'Bengali' : userState.language === 'mr' ? 'Marathi' : 'English'}.`;
      }
    }

    // If no API key, return offline response
    if (!apiKey) {
      return NextResponse.json(getOfflineResponse(messages[messages.length - 1]?.content || ''));
    }

    // Map messages for Gemini API with strict typing
    const geminiMessages = messages.slice(-6).map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt }]
        },
        contents: geminiMessages,
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json",
        }
      }),
    });

    if (!response.ok) {
      console.error('Gemini API Error:', await response.text());
      return NextResponse.json(getOfflineResponse(messages[messages.length - 1]?.content || ''));
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Try to parse JSON response
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return NextResponse.json(parsed);
      }
    } catch (err) { 
      console.warn('Failed to parse AI JSON response, falling back to text parsing.', err);
    }

    // Parse trust level from plain text fallback
    const trustMatch = text.match(/\[TRUST:\s*(OFFICIAL|VERIFIED|EXPLANATORY|UNCERTAIN)\]/i);
    const trustLevel = trustMatch ? trustMatch[1].toUpperCase() : 'EXPLANATORY';
    const cleanText = text.replace(/\[TRUST:.*?\]/gi, '').trim();

    return NextResponse.json({
      answer: cleanText,
      trustLevel,
      quickActions: ['Open My Roadmap', 'Check Eligibility'],
      nextStep: null,
    });

  } catch (error: unknown) {
    console.error('Chat API Error:', error);
    return NextResponse.json({
      answer: 'I apologize, but I am temporarily unavailable. Please try again in a moment. For urgent queries, visit voters.eci.gov.in.',
      trustLevel: 'UNCERTAIN',
      quickActions: ['Try Again', 'Visit ECI Portal'],
      nextStep: null,
    }, { status: 200 });
  }
}

function getOfflineResponse(query: string): { answer: string; trustLevel: string; quickActions: string[]; nextStep: string | null } {
  const q = query.toLowerCase();

  if (q.includes('eligible') || q.includes('age') || q.includes('qualify')) {
    return {
      answer: '**Eligibility:** To vote in India, you must be an Indian citizen, at least 18 years old on a qualifying date (Jan 1, Apr 1, Jul 1, Oct 1), and a resident of the constituency. ECI allows advance registration at 17 years and 6 months.\n\n**Why It Matters:** Early registration ensures your name appears on the voter list in time.\n\n**Next Action:** Use our Eligibility Checker to verify your status.',
      trustLevel: 'OFFICIAL',
      quickActions: ['Check My Eligibility', 'Open Roadmap'],
      nextStep: 'eligibility',
    };
  }
  if (q.includes('register') || q.includes('form 6') || q.includes('enroll')) {
    return {
      answer: '**Registration:** New voters register using Form 6, available at voters.eci.gov.in. You need: proof of age (birth certificate, Class 10 marksheet), proof of address (Aadhaar, utility bill), and a passport-size photo.\n\n**Why It Matters:** Without registration, you cannot vote even if you are eligible.\n\n**Next Action:** Start your registration process in the roadmap.',
      trustLevel: 'OFFICIAL',
      quickActions: ['Start Registration', 'Open Roadmap'],
      nextStep: 'form6',
    };
  }
  if (q.includes('booth') || q.includes('polling') || q.includes('where')) {
    return {
      answer: '**Finding Your Booth:** Enter your EPIC number or details at voters.eci.gov.in to find your assigned polling station. You can also call the ECI helpline 1950.\n\n**Why It Matters:** You can only vote at your designated polling station.\n\n**Next Action:** Use the Polling Guide in the app.',
      trustLevel: 'VERIFIED',
      quickActions: ['Polling Guide', 'Open Roadmap'],
      nextStep: 'polling-station',
    };
  }
  if (q.includes('evm') || q.includes('how to vote') || q.includes('vvpat')) {
    return {
      answer: '**How to Vote:** Enter the booth, show your ID, get ink marked, press the blue button next to your candidate on the EVM. The VVPAT machine will show a paper slip for 7 seconds to verify your vote.\n\n**Why It Matters:** Understanding the process prevents panic on voting day.\n\n**Next Action:** Try our mock EVM simulator to practice!',
      trustLevel: 'VERIFIED',
      quickActions: ['Try Simulator', 'Polling Guide'],
      nextStep: 'mock-vote',
    };
  }
  if (q.includes('complaint') || q.includes('violation') || q.includes('report')) {
    return {
      answer: '**Reporting Violations:** Use the cVIGIL app or our reporting tool to report election violations like vote buying, intimidation, or model code violations. Reports are processed within 100 minutes.\n\n**Why It Matters:** Your report helps ensure free and fair elections.\n\n**Next Action:** File a report through our complaint form.',
      trustLevel: 'VERIFIED',
      quickActions: ['File Report', 'Learn Rules'],
      nextStep: 'report-violation',
    };
  }

  return {
    answer: '**AI is currently in offline mode.** I can help with: voter eligibility, registration (Form 6), finding your polling booth, how to use EVM/VVPAT, reporting violations, and understanding election rules.\n\nTry asking about any of these topics! For detailed queries, visit voters.eci.gov.in.',
    trustLevel: 'EXPLANATORY',
    quickActions: ['Check Eligibility', 'How to Vote', 'Open Roadmap'],
    nextStep: null,
  };
}
