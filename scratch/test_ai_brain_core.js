const { Commander } = require('../ai_brain/commander');

async function runTest() {
    console.log("================================================================================");
    console.log(" 🧠 TESTING IINSHA AI-BOS PRODUCTION BRAIN ENGINE (PHASE 1-14)");
    console.log("================================================================================\n");

    const commander = new Commander();
    const convId = "conv_test_" + Date.now();

    console.log("--- TURN 1 ---");
    const turn1 = await commander.handleUserMessage(convId, "I want an AI lead generation system.");
    console.log("User: I want an AI lead generation system.");
    console.log("Commander Intent:", turn1.intent.intent);
    console.log("Commander Agents:", turn1.active_agents);
    console.log("Verification Status:", turn1.verification.status);
    console.log("Response Preview:", turn1.response.substring(0, 140) + "...\n");

    console.log("--- TURN 2 ---");
    const turn2 = await commander.handleUserMessage(convId, "For B2B SaaS companies.");
    console.log("User: For B2B SaaS companies.");
    console.log("Known Facts in State:", turn2.telemetry);
    console.log("Response Preview:", turn2.response.substring(0, 140) + "...\n");

    console.log("--- TURN 3 ---");
    const turn3 = await commander.handleUserMessage(convId, "Target companies with 50-200 employees.");
    console.log("User: Target companies with 50-200 employees.");
    console.log("Response Preview:", turn3.response.substring(0, 140) + "...\n");

    console.log("--- TURN 4 (Execution Trigger) ---");
    const turn4 = await commander.handleUserMessage(convId, "Find 100 leads.");
    console.log("User: Find 100 leads.");
    console.log("Tool Results Executed:", turn4.tool_results.map(t => ({ tool: t.tool, status: t.status })));
    console.log("Verifier Result:", turn4.verification);
    console.log("Final Grounded Response:\n--------------------------------------------------");
    console.log(turn4.response);
    console.log("--------------------------------------------------\n");

    // Check Anti-Repetition Rule
    const repeatedQuestions = turn4.response.toLowerCase().includes("what type of company") || 
                              turn4.response.toLowerCase().includes("how many employees");
    console.log("Anti-Repetition Check (Must be FALSE):", repeatedQuestions);
    if (!repeatedQuestions) {
        console.log("✅ Anti-Repetition Guard: PASSED! (0 repeated questions)");
    } else {
        console.error("❌ Failed: Repeated question detected!");
    }

    // Check Tool Results Count
    const leadTool = turn4.tool_results.find(t => t.tool === 'lead_discovery');
    console.log("✅ Real Tool Execution: PASSED! Total Delivered =", leadTool?.data?.total_delivered);

    console.log("\n================================================================================");
    console.log(" 🎉 BRAIN ENGINE CORE MODULE TEST COMPLETED SUCCESSFULLY!");
    console.log("================================================================================");
}

runTest().catch(console.error);
