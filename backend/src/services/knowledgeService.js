export function getKnowledge(intent) {
    const data = {
        voting: {
            title: "Voting Process",
            steps: [
                "Check eligibility (must be 18+)",
                "Ensure voter registration is complete",
                "Visit polling station and cast your vote"
            ],
            tip: "Carry a valid voter ID"
        },
        registration: {
            title: "Voter Registration",
            steps: [
                "Visit official voter registration portal",
                "Fill the application form",
                "Submit required documents"
            ],
            tip: "Double-check your details before submitting"
        },
        documents: {
            title: "Required Documents",
            steps: [
                "Aadhaar Card or ID proof",
                "Address proof",
                "Passport-size photo"
            ],
            tip: "Keep both original and copies"
        },
        timeline: {
            title: "Election Timeline",
            steps: [
                "Registration phase",
                "Campaign phase",
                "Voting day"
            ],
            tip: "Check official dates regularly"
        }
    };

    return data[intent] || null;
}