// Offline English-only knowledge base for Voter Pulse AI
// Provides curated response templates for each detected intent

import { type IntentId } from './chatEngine';

export type TrustLevel = 'verified' | 'official' | 'informational' | 'general';

export interface KnowledgeResponse {
  answer: string;
  trustLevel: TrustLevel;
  quickActions: { label: string; action: string }[];
}

const knowledgeBase: Record<IntentId, KnowledgeResponse> = {

  ELIGIBILITY_CHECK: {
    answer:
      `To vote in Indian elections, you must meet these criteria:\n\n` +
      `• You must be an Indian citizen.\n` +
      `• You must be at least 18 years old on the qualifying date (1st January of the year the electoral roll is revised).\n` +
      `• You must be a resident of the constituency where you wish to vote.\n` +
      `• You must not be disqualified under any law (e.g., unsound mind, convicted of certain offences).\n\n` +
      `NRIs can also register as overseas electors under the Representation of the People (Amendment) Act, 2010.`,
    trustLevel: 'official',
    quickActions: [
      { label: 'Check Registration Status', action: 'How do I check if I am registered to vote?' },
      { label: 'Register to Vote', action: 'How do I register as a new voter?' },
      { label: 'NRI Voting', action: 'How can NRIs vote in Indian elections?' },
    ],
  },

  REGISTRATION_HELP: {
    answer:
      `You can register as a new voter through these methods:\n\n` +
      `1. **Online** — Visit the National Voter Service Portal (voters.eci.gov.in) and fill out Form 6.\n` +
      `2. **Mobile App** — Download the Voter Helpline App (available on Android & iOS) and apply directly.\n` +
      `3. **Offline** — Visit your nearest Electoral Registration Office (ERO) or Common Service Centre (CSC) with a filled Form 6.\n\n` +
      `**Documents needed:** Proof of age (birth certificate, marksheet, passport, etc.) and proof of address (Aadhaar, utility bill, bank passbook, etc.).\n\n` +
      `Your name will be added to the electoral roll after verification by the Booth Level Officer (BLO).`,
    trustLevel: 'official',
    quickActions: [
      { label: 'Open NVSP Portal', action: 'Tell me more about the National Voter Service Portal' },
      { label: 'Documents Required', action: 'What documents do I need for voter registration?' },
      { label: 'Track Application', action: 'How do I track my voter registration application?' },
    ],
  },

  BOOTH_LOOKUP: {
    answer:
      `To find your assigned polling booth:\n\n` +
      `1. **Online** — Visit voters.eci.gov.in → "Search in Electoral Roll" → Enter your details or EPIC number to see your booth.\n` +
      `2. **Voter Helpline App** — Use the "Know Your Polling Station" feature.\n` +
      `3. **SMS** — Send SMS: EPIC <your EPIC number> to 1950.\n` +
      `4. **Helpline** — Call the toll-free voter helpline at 1950.\n\n` +
      `On election day, your polling booth details are also printed on your voter slip distributed by the BLO.`,
    trustLevel: 'official',
    quickActions: [
      { label: 'Search by EPIC', action: 'How do I search my booth using EPIC number?' },
      { label: 'Call Helpline', action: 'What is the voter helpline number?' },
      { label: 'Voter Slip', action: 'What is a voter slip and how do I get it?' },
    ],
  },

  CANDIDATE_INFO: {
    answer:
      `You can find information about candidates contesting in your constituency through:\n\n` +
      `1. **Election Commission** — Visit eci.gov.in for official lists of contesting candidates after nominations are filed.\n` +
      `2. **Affidavits** — All candidates must file sworn affidavits with details of criminal cases, assets, liabilities, and educational qualifications. These are publicly available.\n` +
      `3. **MyNeta.info** — Run by the Association for Democratic Reforms (ADR), this website provides detailed analysis of candidate backgrounds.\n` +
      `4. **Voter Helpline App** — Check the "Know Your Candidate" section.\n\n` +
      `Remember: Voter Pulse AI does not endorse any candidate or party. Make an informed choice based on publicly available facts.`,
    trustLevel: 'informational',
    quickActions: [
      { label: 'View Affidavits', action: 'Where can I see candidate affidavits?' },
      { label: 'Check Criminal Cases', action: 'How do I check if a candidate has criminal cases?' },
      { label: 'Candidate Assets', action: 'Where can I find information about candidate assets?' },
    ],
  },

  COMPLAINT_SUPPORT: {
    answer:
      `If you witness any election violation, you can report it through:\n\n` +
      `1. **cVIGIL App** — The Election Commission's official app lets you report violations with photos/videos. Reports are acted upon within 100 minutes.\n` +
      `2. **Voter Helpline (1950)** — Call the toll-free number to report issues verbally.\n` +
      `3. **Online Grievance Portal** — Visit eci.gov.in → Grievance section to file a detailed complaint.\n` +
      `4. **District Election Officer** — Contact your DEO directly for serious matters.\n\n` +
      `**Types of violations you can report:** Cash distribution, liquor distribution, hate speech, misuse of government vehicles, intimidation of voters, booth capturing, and fake news.`,
    trustLevel: 'official',
    quickActions: [
      { label: 'Download cVIGIL', action: 'How do I use the cVIGIL app?' },
      { label: 'Report Bribery', action: 'How do I report vote-buying or bribery?' },
      { label: 'Contact DEO', action: 'How do I reach my District Election Officer?' },
    ],
  },

  VOTING_EXPLANATION: {
    answer:
      `Here is the step-by-step voting process on election day:\n\n` +
      `1. **Arrive** — Go to your assigned polling station during polling hours (typically 7 AM – 6 PM).\n` +
      `2. **Identity Verification** — Show one of the accepted photo IDs to the polling officer.\n` +
      `3. **Ink Application** — Indelible ink is applied on your left index finger.\n` +
      `4. **Receive Slip** — You receive a slip with your serial number.\n` +
      `5. **Enter Booth** — Go to the EVM (Electronic Voting Machine) in the voting compartment.\n` +
      `6. **Cast Vote** — Press the button next to the symbol of your chosen candidate on the ballot unit.\n` +
      `7. **Verify on VVPAT** — A paper slip appears in the VVPAT machine for 7 seconds showing your selected symbol. Verify it.\n` +
      `8. **Exit** — Leave the polling station. Do not photograph the EVM or take any material out.\n\n` +
      `If you find your name missing on the voter list, you can vote using a Tendered Ballot after following the challenge procedure.`,
    trustLevel: 'verified',
    quickActions: [
      { label: 'Accepted IDs', action: 'What are the accepted ID proofs for voting?' },
      { label: 'What is VVPAT?', action: 'Explain what VVPAT is and how it works' },
      { label: 'What is NOTA?', action: 'What does NOTA mean and how do I use it?' },
    ],
  },

  FACT_CHECK: {
    answer:
      `Election misinformation is a serious issue. Here are ways to verify claims:\n\n` +
      `1. **Official Sources** — Always cross-check with eci.gov.in, PIB Fact Check (@PIBFactCheck on Twitter/X), or official state election commission websites.\n` +
      `2. **Fact-Checking Portals** — Use trusted platforms like Alt News, Boom Live, The Quint Fact Check, or India Today Fact Check.\n` +
      `3. **Common Myths:**\n` +
      `   • EVM hacking is not possible — EVMs are standalone, non-networked machines.\n` +
      `   • Your vote is secret — no one, including officials, can see who you voted for.\n` +
      `   • NOTA does not lead to re-election if it gets the most votes — current law does not mandate this.\n\n` +
      `When in doubt, do not forward unverified messages. Report suspicious content to ECI via the Voter Helpline App.`,
    trustLevel: 'informational',
    quickActions: [
      { label: 'EVM Safety', action: 'Are EVMs really tamper-proof?' },
      { label: 'Report Fake News', action: 'How do I report election-related fake news?' },
      { label: 'NOTA Myth', action: 'What happens when NOTA gets the most votes?' },
    ],
  },

  DOCUMENT_HELP: {
    answer:
      `You need one of the following photo identity documents to vote at the polling station:\n\n` +
      `1. Voter ID Card (EPIC) — *primary document*\n` +
      `2. Aadhaar Card\n` +
      `3. MGNREGA Job Card\n` +
      `4. Passbook with photo (issued by Bank/Post Office)\n` +
      `5. Health Insurance Smart Card (Govt. scheme)\n` +
      `6. Driving License\n` +
      `7. PAN Card\n` +
      `8. Indian Passport\n` +
      `9. Smart Card issued by RGI under NPR\n` +
      `10. Pension document with photo\n` +
      `11. Service ID cards issued by Central/State Govt., PSUs, or Public Limited Companies\n` +
      `12. Official ID from MPs/MLAs/MLCs\n\n` +
      `**Important:** Even if you don't have your Voter ID, you can still vote using any of the alternate IDs listed above, as long as your name is on the electoral roll.`,
    trustLevel: 'verified',
    quickActions: [
      { label: 'Lost Voter ID', action: 'I lost my voter ID card. How do I get a duplicate?' },
      { label: 'Aadhaar for Voting', action: 'Can I use only Aadhaar to vote?' },
      { label: 'Apply for EPIC', action: 'How do I apply for a new voter ID card?' },
    ],
  },

  CORRECTION_TRANSFER: {
    answer:
      `To correct details or transfer your voter registration:\n\n` +
      `**Corrections (Form 8):**\n` +
      `• Use Form 8 to correct errors in your name, age, gender, photo, or address on the electoral roll.\n` +
      `• Submit online at voters.eci.gov.in or via the Voter Helpline App.\n\n` +
      `**Transfer / Shifting (Form 6):**\n` +
      `• If you've moved to a new constituency, fill out a fresh Form 6 to register at your new address.\n` +
      `• If you've moved within the same constituency, use Form 8A.\n\n` +
      `**Deletion (Form 7):**\n` +
      `• Use Form 7 to request removal of a deceased person's name or a duplicate entry.\n\n` +
      `All forms can be submitted online at the NVSP portal or via the Voter Helpline App.`,
    trustLevel: 'official',
    quickActions: [
      { label: 'Correct Name', action: 'How do I correct my name on the voter ID?' },
      { label: 'Change Address', action: 'I moved to a new city. How do I transfer my vote?' },
      { label: 'Remove Duplicate', action: 'How do I remove a duplicate entry from the voter list?' },
    ],
  },

  ELECTION_SCHEDULE: {
    answer:
      `Election schedules in India are announced by the Election Commission of India (ECI). Here is how the process works:\n\n` +
      `• **General Elections (Lok Sabha)** — Held every 5 years to elect members of the Lower House of Parliament. The next general election is due in or before 2029.\n` +
      `• **State Assembly Elections (Vidhan Sabha)** — Held every 5 years per state. Dates vary by state.\n` +
      `• **By-Elections** — Held when a seat falls vacant mid-term due to resignation, death, or disqualification.\n\n` +
      `The ECI announces the exact dates, phases, and Model Code of Conduct enforcement period through press conferences and official notifications.\n\n` +
      `Visit eci.gov.in or check the Voter Pulse Election Tracker for the latest schedule updates.`,
    trustLevel: 'official',
    quickActions: [
      { label: 'Upcoming Elections', action: 'Which states have upcoming elections?' },
      { label: 'Election Phases', action: 'Why are elections held in multiple phases?' },
      { label: 'Model Code', action: 'What is the Model Code of Conduct?' },
    ],
  },

  RESULT_INFO: {
    answer:
      `Election results are declared by the Election Commission of India after counting of votes:\n\n` +
      `• **Where to check:** Official results are published on results.eci.gov.in in real time on counting day.\n` +
      `• **Process:** Counting begins at 8 AM on the designated day. Results are declared constituency-by-constituency as counting completes.\n` +
      `• **EVM vs Postal:** Postal ballots are counted first, followed by EVM rounds.\n` +
      `• **VVPAT Verification:** A mandatory random VVPAT paper trail verification of 5 EVMs per assembly segment is conducted before final results.\n\n` +
      `Past election results and statistical data are available on the ECI website and the Election Atlas of India.`,
    trustLevel: 'official',
    quickActions: [
      { label: 'Live Counting', action: 'Where can I watch live vote counting?' },
      { label: 'Past Results', action: 'Where can I find past election results?' },
      { label: 'VVPAT Verification', action: 'How does VVPAT verification work during counting?' },
    ],
  },

  GENERAL_CIVIC: {
    answer:
      `India is the world's largest democracy, and civic participation is both a right and a responsibility.\n\n` +
      `**Your Fundamental Rights (Part III of the Constitution):**\n` +
      `• Right to Equality (Articles 14–18)\n` +
      `• Right to Freedom (Articles 19–22)\n` +
      `• Right against Exploitation (Articles 23–24)\n` +
      `• Right to Freedom of Religion (Articles 25–28)\n` +
      `• Cultural and Educational Rights (Articles 29–30)\n` +
      `• Right to Constitutional Remedies (Article 32)\n\n` +
      `**Your Fundamental Duties (Article 51A):**\n` +
      `• Abide by the Constitution and respect the National Flag & Anthem\n` +
      `• Cherish the ideals of the freedom struggle\n` +
      `• Protect the sovereignty, unity, and integrity of India\n` +
      `• Promote harmony and the spirit of common brotherhood\n\n` +
      `Voting is not just a right — it is a moral duty that strengthens our democracy.`,
    trustLevel: 'verified',
    quickActions: [
      { label: 'Fundamental Rights', action: 'Explain fundamental rights in detail' },
      { label: 'Fundamental Duties', action: 'What are all 11 fundamental duties?' },
      { label: 'Why Vote?', action: 'Why is voting important in a democracy?' },
    ],
  },

  GREETING: {
    answer:
      `Namaste! Welcome to Voter Pulse AI — your trusted civic assistant for Indian elections.\n\n` +
      `I can help you with:\n` +
      `• Checking voter eligibility\n` +
      `• Registering as a new voter\n` +
      `• Finding your polling booth\n` +
      `• Understanding the voting process\n` +
      `• Learning about candidates\n` +
      `• Reporting election violations\n` +
      `• Fact-checking election claims\n` +
      `• Document guidance and corrections\n\n` +
      `Ask me anything about elections and civic participation!`,
    trustLevel: 'general',
    quickActions: [
      { label: 'Am I Eligible?', action: 'Am I eligible to vote?' },
      { label: 'How to Register', action: 'How do I register as a voter?' },
      { label: 'Find My Booth', action: 'Where is my polling booth?' },
    ],
  },

  GENERAL: {
    answer:
      `I'm here to help you with election and civic-related questions! Here are some things I can assist with:\n\n` +
      `• **Voter Eligibility** — Check if you can vote\n` +
      `• **Registration** — Register as a new voter or update details\n` +
      `• **Polling Booth** — Find your assigned booth\n` +
      `• **Voting Process** — Step-by-step guide to casting your vote\n` +
      `• **Candidates** — Learn about contesting candidates\n` +
      `• **Complaints** — Report election violations\n` +
      `• **Fact Check** — Verify election-related claims\n` +
      `• **Documents** — Know what ID proofs to carry\n` +
      `• **Corrections** — Fix errors in your voter details\n` +
      `• **Schedules & Results** — Stay updated on election dates and outcomes\n\n` +
      `Try asking a more specific question and I'll provide detailed guidance!`,
    trustLevel: 'general',
    quickActions: [
      { label: 'Voter Eligibility', action: 'Am I eligible to vote?' },
      { label: 'Register to Vote', action: 'How do I register as a voter?' },
      { label: 'Voting Process', action: 'How do I cast my vote on election day?' },
    ],
  },
};

/**
 * Returns the offline knowledge base response for a given intent.
 * Falls back to the GENERAL intent if the intent is unrecognized.
 */
export function getResponse(intent: string): KnowledgeResponse {
  const key = intent as IntentId;
  return knowledgeBase[key] ?? knowledgeBase.GENERAL;
}
