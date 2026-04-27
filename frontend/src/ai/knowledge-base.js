/* ==========================================
   CivicAlly — Election Knowledge Base
   Comprehensive election process data
   ========================================== */

export const electionPhases = [
  {
    id: 'registration',
    phase: 'PHASE 01',
    name: 'Registration',
    icon: '👤',
    date: 'Ends Sept 15',
    status: 'completed',
    description: 'Voter registration period where eligible citizens can register to vote.',
    details: {
      title: 'Voter Registration',
      steps: [
        { label: 'Check Eligibility', desc: 'Confirm you are 18+ years old, a citizen, and meet residency requirements for your state/district.' },
        { label: 'Choose Registration Method', desc: 'Register online through your state\'s election portal, by mail with a paper form, or in person at your local election office.' },
        { label: 'Provide Required Information', desc: 'Full legal name, date of birth, address, and government-issued ID number (driver\'s license or last 4 of SSN).' },
        { label: 'Submit Application', desc: 'Complete and submit your registration form before the deadline. Most states require registration 15-30 days before election day.' },
        { label: 'Confirm Registration', desc: 'Check your registration status online to ensure your application was processed and your information is correct.' }
      ],
      documents: [
        'Government-issued photo ID (Driver\'s License, Passport, State ID)',
        'Proof of residency (Utility bill, bank statement, lease agreement)',
        'Social Security Number (last 4 digits)',
        'Date of birth verification'
      ],
      tips: [
        'Register early — don\'t wait until the deadline!',
        'Many states allow same-day registration, but check your specific state.',
        'You can update your registration if you move or change your name.'
      ],
      commonMistakes: [
        'Missing the registration deadline',
        'Not updating your address after moving',
        'Providing incorrect information that doesn\'t match your ID'
      ]
    }
  },
  {
    id: 'campaigning',
    phase: 'PHASE 02',
    name: 'Campaigning',
    icon: '📢',
    date: 'Current Phase',
    status: 'active',
    description: 'Candidates campaign, hold debates, and present their platforms to voters.',
    details: {
      title: 'Campaign & Public Sentiment',
      keyMilestone: 'National Televised Debates start this Friday at 8:00 PM EST.',
      body: 'During this phase, candidates focus on grassroots organizing and media outreach. This is your opportunity to research candidates, attend town halls, and understand the issues at stake.',
      tips: [
        'Research all candidates, not just the frontrunners.',
        'Attend local town halls and debates if possible.',
        'Use official sources for candidate platforms — avoid social media misinformation.'
      ]
    }
  },
  {
    id: 'voting',
    phase: 'PHASE 03',
    name: 'Voting Day',
    icon: '🗳️',
    date: 'Nov 05',
    status: 'upcoming',
    description: 'Election day when registered voters cast their ballots at designated polling stations.',
    details: {
      title: 'Casting Your Vote',
      steps: [
        { label: 'Locate Your Polling Station', desc: 'Find your assigned polling location using your voter registration card or your state\'s election website.' },
        { label: 'Bring Required ID', desc: 'Most states require a valid photo ID. Check your state\'s specific requirements beforehand.' },
        { label: 'Arrive at the Polling Station', desc: 'Polls are typically open from 6 AM to 8 PM. Arrive early to avoid long lines.' },
        { label: 'Check In with Poll Workers', desc: 'Provide your name and ID. They\'ll verify your registration and give you a ballot.' },
        { label: 'Mark Your Ballot', desc: 'Enter the voting booth, review your choices carefully, and mark your selections. Ask for help if instructions are unclear.' },
        { label: 'Submit Your Ballot', desc: 'Feed your completed ballot into the scanner or drop it in the ballot box. Collect your "I Voted" sticker!' }
      ],
      votingMethods: [
        { method: 'In Person (Election Day)', desc: 'Vote at your assigned polling station on election day.' },
        { method: 'Early Voting', desc: 'Many states allow voting days or weeks before election day at designated locations.' },
        { method: 'Absentee / Mail-in Ballot', desc: 'Request a ballot by mail, fill it out at home, and return it by mail or at a drop-off location.' }
      ],
      tips: [
        'Bring a valid photo ID even if your state might not require it.',
        'You have the right to vote if you\'re in line before polls close.',
        'If you make a mistake on your ballot, ask for a new one.',
        'You have the right to take time off work to vote in most states.'
      ]
    }
  },
  {
    id: 'counting',
    phase: 'PHASE 04',
    name: 'Counting',
    icon: '📊',
    date: 'Nov 06 - 08',
    status: 'upcoming',
    description: 'Ballots are counted, verified, and audited to ensure accurate results.',
    details: {
      title: 'Vote Counting Process',
      steps: [
        { label: 'Ballot Collection', desc: 'All ballots from polling stations, mail-in, and early voting are collected and transported securely.' },
        { label: 'Initial Count', desc: 'Ballots are fed through optical scanners or counted by hand. Multiple poll workers oversee the process.' },
        { label: 'Provisional Ballot Review', desc: 'Ballots flagged for verification (ID issues, registration problems) are reviewed individually.' },
        { label: 'Audit & Verification', desc: 'Random samples of ballots are re-counted to verify scanner accuracy. Observers from all parties monitor the process.' },
        { label: 'Certification', desc: 'Once all ballots are counted and verified, results are officially certified by election officials.' }
      ],
      tips: [
        'Counting can take days — this is normal and ensures accuracy.',
        'Mail-in ballots often take longer to process than in-person votes.',
        'Both parties have observers watching the counting process.'
      ]
    }
  },
  {
    id: 'results',
    phase: 'PHASE 05',
    name: 'Results',
    icon: '🏆',
    date: 'Nov 10',
    status: 'upcoming',
    description: 'Official results are declared, winners are announced, and the democratic process concludes.',
    details: {
      title: 'Results Declaration',
      steps: [
        { label: 'Unofficial Results', desc: 'Media outlets project winners based on vote counts, but these are unofficial until certified.' },
        { label: 'Official Certification', desc: 'State election boards formally certify results, usually within 1-4 weeks after election day.' },
        { label: 'Transition Period', desc: 'Newly elected officials prepare to take office. Outgoing leaders begin the transition process.' },
        { label: 'Inauguration', desc: 'Elected officials are sworn into office and formally begin their terms.' }
      ],
      tips: [
        'Official results may differ slightly from election night projections.',
        'It\'s normal for close races to require recounts.',
        'Winners are determined by the certified results, not media projections.'
      ]
    }
  }
];

export const faqData = [
  {
    question: 'Who can vote?',
    answer: 'Any citizen over the age of 18 who meets their state\'s residency requirements and is registered to vote by their state\'s voter registration deadline is eligible to participate in federal and local elections.',
    category: 'voting'
  },
  {
    question: 'What documents are required for registration?',
    answer: 'Typically, you will need a valid government-issued photo ID (like a Driver\'s License or Passport) and proof of residency (such as a utility bill or lease agreement). Some states allow for online registration with an existing state ID number.',
    category: 'voting'
  },
  {
    question: 'Can I vote online?',
    answer: 'Currently, online voting is not available for federal elections in most states. However, some states allow online voter registration and absentee ballot requests. You can vote by mail (absentee), early in-person, or on election day at your polling station.',
    category: 'voting'
  },
  {
    question: 'How do I track a specific bill?',
    answer: 'You can track bills and legislation through official government websites like Congress.gov for federal bills, or your state legislature\'s website for state-level legislation. Vote Pilot also provides real-time tracking and plain-language summaries of active bills.',
    category: 'legislation'
  },
  {
    question: 'What if I moved to a new state?',
    answer: 'If you\'ve moved to a new state, you\'ll need to register to vote in your new state. Check your new state\'s registration deadline and requirements. Some states allow same-day registration. Make sure to update or cancel your old registration.',
    category: 'voting'
  },
  {
    question: 'How does the Electoral College work?',
    answer: 'Each state is allocated a number of electors based on its total Congressional representation (Senators + House members). When you vote for President, you\'re actually voting for your state\'s electors. The candidate who wins the most votes in a state typically receives all of that state\'s electoral votes. A candidate needs 270 out of 538 electoral votes to win.',
    category: 'legislation'
  },
  {
    question: 'Is my vote private?',
    answer: 'Yes, your individual vote is completely private and confidential. While voter registration records (your name, address, party affiliation) may be public, how you marked your ballot is never recorded or shared. Voting booths are designed to ensure privacy.',
    category: 'privacy'
  },
  {
    question: 'What is gerrymandering?',
    answer: 'Gerrymandering is the practice of drawing electoral district boundaries to favor a particular political party or group. It can dilute the voting power of certain communities. Many states are working on independent redistricting commissions to create fairer maps.',
    category: 'legislation'
  }
];

export const misinformationDB = [
  {
    claim: 'dead people vote',
    correction: 'While isolated cases of ballots cast in the names of deceased individuals have occurred, these are extremely rare and are caught by verification systems. Studies consistently show that voter fraud of any kind is exceedingly rare, affecting 0.0001% of ballots.',
    source: 'Brennan Center for Justice'
  },
  {
    claim: 'voting machines are rigged',
    correction: 'Voting machines undergo rigorous testing, certification, and auditing before each election. They are not connected to the internet during voting. Post-election audits, including hand recounts of paper trails, consistently confirm the accuracy of machine counts.',
    source: 'Election Assistance Commission'
  },
  {
    claim: 'mail-in voting is fraudulent',
    correction: 'Mail-in voting has been used safely for decades. Every mail-in ballot goes through multiple verification steps including signature matching and barcode tracking. Studies show fraud rates with mail-in ballots are between 0.00004% and 0.0025%.',
    source: 'MIT Election Data + Science Lab'
  },
  {
    claim: 'non-citizens can vote',
    correction: 'Federal law prohibits non-citizens from voting in federal elections. Voter registration requires attestation of citizenship, and states use multiple databases to verify eligibility. Voting as a non-citizen is a federal crime with severe penalties.',
    source: 'National Voter Registration Act'
  },
  {
    claim: 'my vote doesn\'t matter',
    correction: 'Every vote matters! Many elections have been decided by razor-thin margins. In 2000, the presidential election was decided by 537 votes in Florida. Local elections often have margins of less than 100 votes. Your participation directly shapes policy.',
    source: 'Historical Election Records'
  }
];

export const electionDates = {
  onlineRegistration: { label: 'ONLINE REGISTRATION', date: 'October 15, 2024' },
  inPersonRegistration: { label: 'IN-PERSON/MAIL', date: 'October 10, 2024' },
  earlyVoting: { label: 'EARLY VOTING BEGINS', date: 'October 21, 2024' },
  electionDay: { label: 'ELECTION DAY', date: 'November 5, 2024' },
  resultsExpected: { label: 'RESULTS EXPECTED', date: 'November 6-10, 2024' }
};

export const guideSteps = [
  {
    step: 'STEP 01',
    icon: '📋',
    iconClass: 'blue',
    title: 'Check Eligibility',
    description: 'Confirm you meet the age, citizenship, and residency requirements for your specific jurisdiction.',
    action: 'Learn More',
    actionIcon: '→',
    verified: true
  },
  {
    step: 'STEP 02',
    icon: '📝',
    iconClass: 'cyan',
    title: 'Register to Vote',
    description: 'Complete your registration online or via mail. Check the deadline for your state to ensure you\'re on the roll.',
    action: 'Register Now',
    actionIcon: '↗'
  },
  {
    step: 'STEP 03',
    icon: '🪪',
    iconClass: 'purple',
    title: 'Secure Voter ID',
    description: 'Most states require a specific form of identification. Find out which documents are accepted and how to get one.',
    action: 'ID Requirements',
    actionIcon: '📄'
  },
  {
    step: 'STEP 04',
    icon: '🔍',
    iconClass: 'orange',
    title: 'Research the Ballot',
    description: 'Don\'t just vote for names you recognize. Dive deep into candidate platforms and local referendums with our AI-powered summaries.',
    action: 'Explore Local Candidates',
    actionIcon: '🔎'
  },
  {
    step: 'STEP 05',
    icon: '📍',
    iconClass: 'red',
    title: 'Find Polling Site',
    description: 'Your polling location may have changed since the last election. Confirm your spot and check expected wait times.',
    action: 'Open Map',
    actionIcon: '📌'
  }
];

export const civicTips = [
  'In your state, you have the right to <strong>paid time off</strong> to vote if your shift doesn\'t allow for 3 consecutive non-work hours while polls are open.',
  'You can track your absentee ballot\'s journey from printing to counting using your state\'s <strong>ballot tracking system</strong>.',
  'Most polling places are required to be <strong>wheelchair accessible</strong>. Contact your local election office if you need accommodation.',
  'You can bring a <strong>sample ballot or notes</strong> into the voting booth in most states to help you remember your choices.',
  'If you experience issues at the polls, call the <strong>Election Protection Hotline: 1-866-OUR-VOTE</strong> for free, nonpartisan assistance.'
];
