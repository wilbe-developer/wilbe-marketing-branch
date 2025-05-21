
import { SurveyQuestion } from '../types';

  // All questions in a single array
export const allQuestions: SurveyQuestion[] = [
  {
    id: "q1",
    text: "Your TTO says, \"We're excited to explore options!\" Two months pass. You…",
    options: [
      "Follow up with a polite email and wait another month.",
      "CC a senior admin and gently suggest a timeline.",
      "File a provisional yourself and backdate your lab notebook.",
      "Print the patent draft, set it on fire, and forward the ashes to your PI."
    ],
    category: 'academic',
    tags: ['intellectual-property', 'tto']
  },
  {
    id: "q2",
    text: "You pitch your startup to your PI. They say, \"Let's co-lead it.\" You…",
    options: [
      "Say yes—it'll make the TTO negotiation easier, and you need the letter anyway.",
      "Offer a token equity slice and a ceremonial job title.",
      "Say \"sure,\" then list them as \"passive advisor\" in your deck.",
      "Add them to the cap table with 0.0001% and a cliff that starts after death."
    ],
    category: 'academic',
    tags: ['equity', 'founders']
  },
  {
    id: "q3",
    text: "You're asked, \"Who actually owns this idea?\" You…",
    options: [
      "Say \"The university, I think? Maybe my PI?\"",
      "Mention your name is on the paper and hope that counts.",
      "Say, \"Let's not worry about that yet.\"",
      "Reply, \"Whoever builds it first. So... me.\""
    ],
    category: 'ip',
    tags: ['ownership', 'academic']
  },
  {
    id: "q4",
    text: "Your invention wins a poster prize. Your TTO says, \"Let's form a committee.\" You…",
    options: [
      "Ask who'll be on it and what the mandate is.",
      "Offer to write the recommendations yourself and send them for sign-off.",
      "Schedule a 7-person meeting during conference week and don't show up.",
      "Replace the poster with a QR code that links to your Delaware C-Corp."
    ],
    category: 'academic',
    tags: ['bureaucracy', 'tto']
  },
  {
    id: "q5",
    text: "Your best undergrad asks how they can help. You…",
    options: [
      "Ask them to assist with data cleaning and give them credit.",
      "Assign them a moonshot side project and say \"surprise me.\"",
      "Tell them they're Chief Product Officer and hand over your login.",
      "Rename the company after them and tell no one."
    ],
    category: 'team',
    tags: ['mentorship', 'roles']
  },
  {
    id: "q6",
    text: "Your experiment *finally* works. A startup just raised $4M with worse data. You…",
    options: [
      "Use it to support your next grant—proof of market need.",
      "Quietly benchmark your results and start cold emailing angels.",
      "Tweet \"lol\" with a screenshot of their figure.",
      "Show up to their demo day wearing your lab coat and holding your western blot like a scroll."
    ],
    category: 'strategy',
    tags: ['competition', 'funding']
  },
  {
    id: "q7",
    text: "You wake up in a cold sweat. You'd just dreamt about…",
    options: [
      "Reviewer 2 rejecting your pitch deck.",
      "Your PI submitting your invention as \"collaborative.\"",
      "Missing your patent filing deadline.",
      "Launching your startup… at your thesis defense."
    ],
    category: 'academic',
    tags: ['anxiety', 'humor']
  },
  {
    id: "q8",
    text: "You're offered £250K to spin out your idea. The TTO wants 15% and your PI wants veto rights. You…",
    options: [
      "Decline. It's not worth the friction.",
      "Negotiate—slowly.",
      "Sign fast and deal with fallout later.",
      "Leave and start fresh—no strings."
    ],
    category: 'funding',
    tags: ['negotiation', 'academic']
  },
  {
    id: "q9",
    text: "You're offered $100K from a sketchy angel investor. You…",
    options: [
      "Politely decline and focus on non-dilutive grants.",
      "Take the meeting, ask smart questions.",
      "Send them a deck with no watermark.",
      "Ask if they accept blood equity."
    ],
    category: 'funding',
    tags: ['investor', 'due-diligence']
  },
  {
    id: "q10",
    text: "Your funding deadline is in 48 hours. Your co-founder is in silent retreat. You…",
    options: [
      "Wait and respect their boundaries.",
      "Try calling once, just in case.",
      "Write the grant alone and list them as 'on leave.'",
      "Submit without them and rename the startup 'Monologue Bio.'"
    ],
    category: 'team',
    tags: ['deadlines', 'cofounder']
  },
  {
    id: "q11",
    text: "Your colleague says, \"Careful, the TTO might block that.\" You…",
    options: [
      "Pause and check your institution's policy.",
      "Ask your PI what they think.",
      "Do it anyway and deal with the fallout later.",
      "Print the policy, burn it, and record it as B-roll for your pitch video."
    ],
    category: 'academic',
    tags: ['policy', 'risk']
  },
  {
    id: "q12",
    text: "You pitch to a VC who clearly doesn't understand your science. You…",
    options: [
      "Try to simplify and educate respectfully.",
      "Ask if there's someone technical on their team.",
      "End early and suggest they circle back later.",
      "Say \"It's like Uber for CRISPR,\" then ask for $2M."
    ],
    category: 'funding',
    tags: ['vc', 'communication']
  },
  {
    id: "q13",
    text: "Your PhD student says they want to start a company too. You…",
    options: [
      "Encourage them—it's exciting.",
      "Offer to mentor them on weekends.",
      "Tell them to graduate first, then join you.",
      "Give them one task: \"Build fast or be forgotten.\""
    ],
    category: 'academic',
    tags: ['mentorship', 'entrepreneurship']
  },
  {
    id: "q14",
    text: "A VC says your market is \"too small.\" You…",
    options: [
      "Refine your TAM and resubmit.",
      "Say \"That's true—until we win it.\"",
      "Ask if they've ever heard of compound interest.",
      "Whisper \"You lack vision\" and vanish from the Zoom."
    ],
    category: 'funding',
    tags: ['vc', 'market']
  },
  {
    id: "q15",
    text: "You realize your tech has scary dual-use potential. You…",
    options: [
      "Flag it to your ethics board.",
      "Add guardrails to your implementation.",
      "Keep building—let regulators catch up.",
      "Rename it \"Project Cerberus\" and deny everything."
    ],
    category: 'ethics',
    tags: ['dual-use', 'responsibility']
  },
  {
    id: "q16",
    text: "A pharma exec offers to \"advise you\"—with no terms. You…",
    options: [
      "Ask what they're looking for long-term.",
      "Offer advisor equity with a clear vesting schedule.",
      "Say yes, but mute them in Slack.",
      "Add them to the team slide with a footnote: \"free trial.\""
    ],
    category: 'strategy',
    tags: ['advisors', 'pharma']
  },
  {
    id: "q17",
    text: "You run out of grant funding mid-prototype. You…",
    options: [
      "Freeze spend and reassess milestones.",
      "Write three new grants overnight.",
      "Max out two personal credit cards.",
      "Sell your lab coat as an NFT."
    ],
    category: 'funding',
    tags: ['grants', 'runway']
  },
  {
    id: "q18",
    text: "Your university says they own your code. You…",
    options: [
      "Check your employment agreement.",
      "Offer to license it back.",
      "Refactor everything and rename the repo.",
      "Upload a decoy version with bugs and bounce."
    ],
    category: 'ip',
    tags: ['software', 'ownership']
  },
  {
    id: "q19",
    text: "You're asked, \"What's your unfair advantage?\" You…",
    options: [
      "Say \"Deep science + founder obsession.\"",
      "Say \"The team.\" Always the team.",
      "Say \"I'm still here while everyone else quit.\"",
      "Whisper \"rage and unresolved trauma.\""
    ],
    category: 'strategy',
    tags: ['pitch', 'competitive-advantage']
  },
  {
    id: "q20",
    text: "You just got accepted to a top accelerator. Your lab says you can't go. You…",
    options: [
      "Try to negotiate a part-time workaround.",
      "Take a leave of absence and hope they don't notice.",
      "Go anyway and tell no one.",
      "File for IP, drop your badge, and vanish like Batman."
    ],
    category: 'academic',
    tags: ['career', 'accelerator']
  },
  {
    id: "q21",
    text: "Your co-founder disappears for 2 weeks during diligence. You…",
    options: [
      "Assume something personal came up and give them space.",
      "Start prepping explanations just in case.",
      "Replace them in the deck with someone you met last night.",
      "List them under \"non-linear contributor\" and move on."
    ],
    category: 'team',
    tags: ['cofounder', 'diligence']
  },
  {
    id: "q22",
    text: "You're told your idea is too early for VCs and too late for grants. You…",
    options: [
      "Reposition it based on the feedback.",
      "Try both routes anyway with different framing.",
      "Call it \"pre-seed-pre-translational-deep-infra.\"",
      "Start selling T-shirts with that quote."
    ],
    category: 'funding',
    tags: ['positioning', 'financing']
  },
  {
    id: "q23",
    text: "You're invited to a \"founder dinner\" with 30 MBAs. You…",
    options: [
      "Attend and try to network.",
      "Ask if any scientists will be there.",
      "Go, drink, and collect names to avoid later.",
      "Host a parallel event titled \"Real Founders Only.\""
    ],
    category: 'strategy',
    tags: ['networking', 'events']
  },
  {
    id: "q24",
    text: "Your mentor tells you to focus on publications, not companies. You…",
    options: [
      "Thank them and consider their point.",
      "Ask what they'd do with your data.",
      "Smile, nod, and file incorporation papers that night.",
      "Submit a preprint called \"Why Papers Don't Cure Cancer.\""
    ],
    category: 'academic',
    tags: ['mentorship', 'career']
  },
  {
    id: "q25",
    text: "Your old PI asks for equity in your startup. You…",
    options: [
      "Ask what kind of involvement they want.",
      "Offer a consulting role and token equity.",
      "Redirect them to the TTO and block their number.",
      "Send them a pitch deck titled \"The Cost of Micromanagement.\""
    ],
    category: 'academic',
    tags: ['equity', 'negotiation']
  },
  {
    id: "q26",
    text: "You just finished a 3-year postdoc. No job, no grant, no plan. You…",
    options: [
      "Apply to fellowships and industry roles.",
      "Email friends about possible projects.",
      "Incorporate something and pray.",
      "Buy a domain, mint a logo, and call it destiny."
    ],
    category: 'academic',
    tags: ['career', 'transition']
  },
  {
    id: "q27",
    text: "Your academic friend says startups are \"selling out.\" You…",
    options: [
      "Disagree politely—there's impact in both worlds.",
      "Point to a paper you authored and a drug it inspired.",
      "Ask how many patients their h-index saved.",
      "Respond: \"Capitalism is a tool. So is my scalpel.\""
    ],
    category: 'academic',
    tags: ['culture', 'impact']
  },
  {
    id: "q28",
    text: "An investor asks \"What's your moat?\" You…",
    options: [
      "Explain your IP, data, and deep tech angle.",
      "Say your domain expertise makes it hard to replicate.",
      "Say \"me\"—then explain why.",
      "Pull out a literal drawbridge model and say \"this.\""
    ],
    category: 'funding',
    tags: ['investor', 'competitive-advantage']
  },
  {
    id: "q29",
    text: "Your university emails saying \"We need to revisit your IP position.\" You…",
    options: [
      "Respond promptly and ask for clarification.",
      "Loop in legal and schedule a call.",
      "Send them a screenshot of your incorporation docs.",
      "Reply with a meme and the words \"Try me.\""
    ],
    category: 'ip',
    tags: ['university', 'ownership']
  },
  {
    id: "q30",
    text: "You run into your old PI at a conference. They pretend not to see you. You…",
    options: [
      "Let it go—probably nothing personal.",
      "Send a polite follow-up email later.",
      "Say hi and see how they react.",
      "Walk on stage and thank them for the trauma."
    ],
    category: 'academic',
    tags: ['relationship', 'pi']
  },
  {
    id: "q31",
    text: "You're invited to speak at a conference—if you pay the travel costs. You…",
    options: [
      "Accept. The visibility is worth it.",
      "Try to expense it through your lab.",
      "Offer to speak remotely, then don't.",
      "Show up anyway and hijack the mic during lunch."
    ],
    category: 'academic',
    tags: ['conference', 'visibility']
  },
  {
    id: "q32",
    text: "Your university wants 60% of revenue from licensing. You…",
    options: [
      "Ask for a breakdown and precedent.",
      "Push for 20% citing peer institutions.",
      "Redirect IP to a shell company in Estonia.",
      "Tell them \"60% of zero is still zero,\" and hang up."
    ],
    category: 'ip',
    tags: ['licensing', 'negotiation']
  },
  {
    id: "q33",
    text: "You're doing a seminar talk. Your slides crash. You…",
    options: [
      "Reboot and try again calmly.",
      "Narrate the content and keep going.",
      "Pull up your figures from Google Drive.",
      "Draw everything on the whiteboard and call it performance art."
    ],
    category: 'academic',
    tags: ['presentation', 'resilience']
  },
  {
    id: "q34",
    text: "A biotech CEO asks you to \"collaborate\" but offers no equity. You…",
    options: [
      "Ask for clarity and timeline.",
      "Suggest a convertible note or joint IP.",
      "Nod, then ghost them forever.",
      "Say yes, and immediately leak their emails to TechCrunch."
    ],
    category: 'strategy',
    tags: ['collaboration', 'equity']
  },
  {
    id: "q35",
    text: "Your startup name gets flagged by your university's branding office. You…",
    options: [
      "Apologize and choose something more neutral.",
      "Modify the name slightly and hope they don't notice.",
      "Keep it and remove your university affiliation.",
      "Register a trademark called \"F*** Your Guidelines LLC.\""
    ],
    category: 'academic',
    tags: ['branding', 'conflict']
  },
  {
    id: "q36",
    text: "A potential investor asks for references from your PI. You…",
    options: [
      "Provide three glowing academic contacts.",
      "Offer your PI's email, but warn he responds slowly.",
      "Say your PI passed away (he didn't).",
      "Say, \"Sure,\" then disappear into the Swiss Alps for 6 months."
    ],
    category: 'funding',
    tags: ['investor', 'references']
  },
  {
    id: "q37",
    text: "You find a competitor with your exact idea, two months ahead. You…",
    options: [
      "Reassess and explore a pivot.",
      "Contact them to explore a partnership.",
      "Rebuild everything under a new name and launch anyway.",
      "Buy their domain and redirect it to your GitHub repo."
    ],
    category: 'strategy',
    tags: ['competition', 'pivot']
  },
  {
    id: "q38",
    text: "Your first pitch deck gets torn apart by an investor. You…",
    options: [
      "Thank them and ask for feedback.",
      "Defend two or three core points calmly.",
      "Ask them to read your Nature paper instead.",
      "Print their comments, frame them, and hang it in the bathroom."
    ],
    category: 'funding',
    tags: ['pitch', 'feedback']
  },
  {
    id: "q39",
    text: "Your co-founder says \"maybe we should just get jobs.\" You…",
    options: [
      "Consider it—this is getting hard.",
      "Say, \"Let's give it 30 more days.\"",
      "Ask if they want to be CTO or get out.",
      "Reply, \"Then you're already gone.\""
    ],
    category: 'team',
    tags: ['cofounder', 'motivation']
  },
  {
    id: "q40",
    text: "The TTO asks for 30% equity. You…",
    options: [
      "Request a call to discuss norms.",
      "Counter with 10% and perpetual access to lab reagents.",
      "Pretend your startup doesn't exist yet.",
      "Send them a picture of Monopoly money and a middle finger emoji."
    ],
    category: 'ip',
    tags: ['tto', 'equity']
  },
  {
    id: "q41",
    text: "A VC offers you $500K with insane terms. You…",
    options: [
      "Decline. The cap table matters.",
      "Negotiate—at least it's money.",
      "Take it and start a \"terms don't matter\" Slack group.",
      "Accept, then raise a SAFE on top to bury it."
    ],
    category: 'funding',
    tags: ['vc', 'terms']
  },
  {
    id: "q42",
    text: "Your advisor wants to be listed as a scientific co-founder. You…",
    options: [
      "Include them—optics are good.",
      "Give them a title with no equity.",
      "List them as \"spiritual ancestor.\"",
      "Write \"co-founder\" in invisible ink."
    ],
    category: 'team',
    tags: ['advisor', 'founders']
  },
  {
    id: "q43",
    text: "The NIH emails you: grant denied. You…",
    options: [
      "Reapply with edits. It's part of the process.",
      "Ask your mentor to call the program officer.",
      "Convert the grant into a seed deck and raise privately.",
      "Publish the rejected grant as a blog post called \"The NIH Doesn't Fund Vision.\""
    ],
    category: 'funding',
    tags: ['grants', 'rejection']
  },
  {
    id: "q44",
    text: "The best undergrad you've ever mentored asks if they can help. You…",
    options: [
      "Involve them in your next experiment and support their growth.",
      "Assign them a moonshot side project and say \"surprise me.\"",
      "Make them your Chief Everything Officer until they burn out.",
      "Rename the company after them and tell no one."
    ],
    category: 'team',
    tags: ['mentorship', 'roles']
  },
  {
    id: "q45",
    text: "Your TTO says, \"Let's wait to file the patent until it's published.\" You…",
    options: [
      "Nod. That makes sense.",
      "Ask for a meeting to understand timelines.",
      "Push to file anyway.",
      "File it yourself, under your name."
    ],
    category: 'ip',
    tags: ['patent', 'tto']
  },
  {
    id: "q46",
    text: "Your lab manager asks if your startup will distract from your research. You…",
    options: [
      "Assure them your work priorities are unchanged.",
      "Say it's all aligned—it's translational impact.",
      "Say \"Yes. That's the point.\"",
      "Ask if they want equity or silence."
    ],
    category: 'academic',
    tags: ['balance', 'priorities']
  },
  {
    id: "q47",
    text: "A VC says, \"We don't do science.\" You…",
    options: [
      "Thank them and move on.",
      "Ask for intro to someone who does.",
      "Say, \"Cool, I don't do hand-wavy TAMs.\"",
      "Mail them a pipette filled with sarcasm."
    ],
    category: 'funding',
    tags: ['vc', 'rejection']
  },
  {
    id: "q48",
    text: "You're asked for your CAC:LTV ratio. You…",
    options: [
      "Share what you've modeled so far.",
      "Say, \"We're still validating but here's our logic.\"",
      "Pivot the conversation to vision.",
      "Ask if they want the PowerPoint version or the napkin sketch."
    ],
    category: 'strategy',
    tags: ['metrics', 'business-model']
  },
  {
    id: "q49",
    text: "A random MBA messages you offering to be your CEO. You…",
    options: [
      "Say no thanks—already covered.",
      "Ask what they bring to the table.",
      "Respond with \"CEO of what, exactly?\"",
      "Invite them to your company, then change the locks."
    ],
    category: 'team',
    tags: ['ceo', 'roles']
  },
  {
    id: "q50",
    text: "Your paper gets desk-rejected. You…",
    options: [
      "Rework and send to another journal.",
      "Post it on bioRxiv and tweet it.",
      "Submit it as a startup idea instead.",
      "Screenshot the rejection and raise $1M off the pain."
    ],
    category: 'academic',
    tags: ['publication', 'rejection']
  },
  {
    id: "q51",
    text: "Your academic friends stop inviting you to journal clubs. You…",
    options: [
      "Ask if things are okay.",
      "Join once in a while to stay connected.",
      "Start your own founder reading group.",
      "Launch a club called \"Exit-Only Mondays.\""
    ],
    category: 'academic',
    tags: ['relationships', 'community']
  },
  {
    id: "q52",
    text: "Your funder wants \"pre-reads\" before every meeting. You…",
    options: [
      "Provide concise updates ahead of time.",
      "Ask what exactly they're hoping to see.",
      "Send decoy decks to test who's reading.",
      "Submit a 100-slide deck that loops back on itself."
    ],
    category: 'funding',
    tags: ['investor-relations', 'communication']
  },
  {
    id: "q53",
    text: "You notice another founder copied your product language. You…",
    options: [
      "Let it slide—it's the game.",
      "Polish your messaging until it's untouchable.",
      "Buy their domain name out of spite.",
      "Start a new startup that clones them harder."
    ],
    category: 'strategy',
    tags: ['competition', 'messaging']
  },
  {
    id: "q54",
    text: "You see your startup logo in a meme. You…",
    options: [
      "Smile—it's exposure.",
      "DM the poster with thanks.",
      "Screenshot it and include it in your next investor update.",
      "Print it on stickers and slap them around MIT."
    ],
    category: 'strategy',
    tags: ['branding', 'social-media']
  },
  {
    id: "q55",
    text: "Someone calls you \"non-technical.\" You…",
    options: [
      "Clarify your scientific background.",
      "Highlight your leadership in building the tech.",
      "Respond with your citation count.",
      "Say \"I code in blood and regrets.\""
    ],
    category: 'academic',
    tags: ['perception', 'skills']
  },
  {
    id: "q56",
    text: "Your team can't agree on a company name. You…",
    options: [
      "Facilitate a naming session with criteria.",
      "Choose the least bad one and move on.",
      "Name it after your worst reviewer.",
      "Let your lab mouse click randomly on a keyboard and ship it."
    ],
    category: 'strategy',
    tags: ['branding', 'decision-making']
  },
  {
    id: "q57",
    text: "An investor asks, \"Is this really a company, or just a project?\" You…",
    options: [
      "Walk them through the vision and business model.",
      "Say \"It's a project—until someone wires money.\"",
      "Ask if their fund is real or just a tax write-off.",
      "Say \"It's a cult, actually,\" and send a calendar invite."
    ],
    category: 'funding',
    tags: ['investor', 'vision']
  },
  {
    id: "q58",
    text: "You find out your patent was filed after public disclosure. You…",
    options: [
      "Check for grace period eligibility.",
      "Call your TTO in a panic.",
      "File a new provisional and pray.",
      "Create a new molecule, new name, new you."
    ],
    category: 'ip',
    tags: ['patent', 'disclosure']
  },
  {
    id: "q59",
    text: "A VC tells you your science is too complicated. You…",
    options: [
      "Simplify the explanation for clarity.",
      "Offer a technical deep-dive later.",
      "Say \"We're not a DTC vitamin brand.\"",
      "Ask if they prefer pictures or finger puppets."
    ],
    category: 'funding',
    tags: ['vc', 'communication']
  },
  {
    id: "q60",
    text: "You realize your academic collaborators don't believe in the startup. You…",
    options: [
      "Try to align on shared goals.",
      "Reduce their role in the project.",
      "Cut them out and don't look back.",
      "Launch a stealth mode Slack called \"No Cowards Allowed.\""
    ],
    category: 'team',
    tags: ['collaboration', 'alignment']
  },
  {
    id: "q61",
    text: "You get invited to a VC's ski retreat. You don't ski. You…",
    options: [
      "Go and hang with the non-skiers.",
      "Take one lesson and wing it.",
      "Show up in all black and talk term sheets.",
      "Snowboard straight into their LP meeting."
    ],
    category: 'funding',
    tags: ['vc', 'networking']
  },
  {
    id: "q62",
    text: "Your CTO wants to refactor everything… again. You…",
    options: [
      "Discuss pros and cons, then decide together.",
      "Ask for a detailed timeline and risk analysis.",
      "Tell them to do it on a forked branch quietly.",
      "Say \"Ship or die\" and send them a vintage pager."
    ],
    category: 'team',
    tags: ['cto', 'technical-debt']
  },
  {
    id: "q63",
    text: "Your top scientist is also applying for faculty jobs. You…",
    options: [
      "Support their growth either way.",
      "Ask them for transparency on timelines.",
      "Offer a co-founder upgrade if they stay.",
      "Replace their calendar with pitch decks."
    ],
    category: 'team',
    tags: ['retention', 'academic']
  },
  {
    id: "q64",
    text: "You're told your team is \"too academic.\" You…",
    options: [
      "Acknowledge and share your hiring roadmap.",
      "Emphasize strengths and unique insights.",
      "Say, \"Yeah, but we're scary smart.\"",
      "Say, \"Let's see how academic we look at IPO.\""
    ],
    category: 'team',
    tags: ['hiring', 'culture']
  },
  {
    id: "q65",
    text: "You realize your idea overlaps with a DARPA project. You…",
    options: [
      "Do more diligence and map the differences.",
      "Reach out to the team quietly.",
      "Pitch it anyway—faster and leaner.",
      "Submit your application with a blacked-out name."
    ],
    category: 'strategy',
    tags: ['government', 'competition']
  },
  {
    id: "q66",
    text: "A grant reviewer writes \"This feels like a company.\" You…",
    options: [
      "Soften the language and resubmit.",
      "Add exploratory language to hide the ambition.",
      "Screenshot it and post it on LinkedIn.",
      "Include it in your pitch deck as a testimonial."
    ],
    category: 'funding',
    tags: ['grants', 'positioning']
  },
  {
    id: "q67",
    text: "Your postdoc says, \"I want to commercialize this myself.\" You…",
    options: [
      "Support them and offer guidance.",
      "Ask if they'd consider co-founding.",
      "Panic slightly, then mentor them.",
      "Start building faster so they can't."
    ],
    category: 'academic',
    tags: ['mentorship', 'ownership']
  },
  {
    id: "q68",
    text: "Your startup burns through half its cash in a month. You…",
    options: [
      "Review expenses and optimize immediately.",
      "Reforecast and tighten hiring plans.",
      "Raise another bridge round, quietly.",
      "Rename your board folder \"Apocalypse Plan.\""
    ],
    category: 'funding',
    tags: ['burn-rate', 'finance']
  },
  {
    id: "q69",
    text: "A pharma company wants to \"explore collaboration.\" You…",
    options: [
      "Ask for a formal proposal.",
      "Set a tight agenda and timeline.",
      "Offer NDAs and push for exclusivity.",
      "Smile, shake hands, and start building their competitor."
    ],
    category: 'strategy',
    tags: ['pharma', 'collaboration']
  },
  {
    id: "q70",
    text: "You're asked in a panel: \"What keeps you going?\" You…",
    options: [
      "Say \"solving meaningful problems.\"",
      "Say \"my team and our mission.\"",
      "Say \"anger, mostly.\"",
      "Say \"revenge.\""
    ],
    category: 'strategy',
    tags: ['motivation', 'public-speaking']
  },
  {
    id: "q71",
    text: "A journalist emails you for comment. You…",
    options: [
      "Reply promptly with talking points.",
      "Forward to your comms person.",
      "Say \"off record\" then spill too much.",
      "Demand they call you \"visionary renegade\" in the headline."
    ],
    category: 'strategy',
    tags: ['media', 'communication']
  },
  {
    id: "q72",
    text: "You're invited to a startup award you didn't apply for. You…",
    options: [
      "Attend—it's good exposure.",
      "Ask who's sponsoring and why.",
      "Use it in your next investor email.",
      "Decline and start your own award called \"Exit or Die.\""
    ],
    category: 'strategy',
    tags: ['recognition', 'marketing']
  },
  {
    id: "q73",
    text: "A junior scientist asks \"How do I get where you are?\" You…",
    options: [
      "Share your story with honesty.",
      "Offer to mentor if they're serious.",
      "Say \"Ignore most advice, including mine.\"",
      "Hand them your therapy bill and a pitch deck."
    ],
    category: 'academic',
    tags: ['mentorship', 'career']
  },
  {
    id: "q74",
    text: "Your Slack workspace is dead silent. You…",
    options: [
      "Ask if people are stuck or need help.",
      "Add async standups and structure.",
      "Rename the channels with passive-aggressive emojis.",
      "Nuke it and start a Discord called \"Doers Only.\""
    ],
    category: 'team',
    tags: ['communication', 'culture']
  },
  {
    id: "q75",
    text: "Your startup's MVP is ugly but functional. You…",
    options: [
      "Launch anyway and gather feedback.",
      "Do a design sprint before demo day.",
      "Call it \"brutalist biotech.\"",
      "Put a pink gradient on it and call it Web3."
    ],
    category: 'strategy',
    tags: ['mvp', 'design']
  },
  {
    id: "q76",
    text: "Your co-founder says they need a sabbatical mid-sprint. You…",
    options: [
      "Discuss their reasons and plan coverage.",
      "Push back and ask for a compromise.",
      "Say, \"If you leave, stay gone.\"",
      "Wish them well, then absorb their equity like a black hole."
    ],
    category: 'team',
    tags: ['cofounder', 'burnout']
  },
  {
    id: "q77",
    text: "Your lead scientist wants to pivot the entire product. You…",
    options: [
      "Ask for a written rationale and data.",
      "Run a parallel test to validate.",
      "Give them 3 weeks and a deadline.",
      "Say \"Sure,\" and update your investors after it works."
    ],
    category: 'strategy',
    tags: ['pivot', 'product']
  },
  {
    id: "q78",
    text: "A startup you respect publishes your idea, with worse data. You…",
    options: [
      "Feel hollow. It's too late.",
      "Leave a nice comment.",
      "Rerun experiments and go faster.",
      "Screenshot it and send it to their investors like: 👀"
    ],
    category: 'strategy',
    tags: ['competition', 'validation']
  },
  {
    id: "q79",
    text: "Your advisor rewrites your abstract—again. You…",
    options: [
      "Thank them. They've done this before.",
      "Edit it back. Quietly.",
      "Send your own version to the conference.",
      "Realize you need to own your story—and your IP."
    ],
    category: 'academic',
    tags: ['advisor', 'communication']
  },
  {
    id: "q80",
    text: "A startup raises $20M off of a version of your thesis. You…",
    options: [
      "Clap from afar.",
      "Leave a nice comment.",
      "Read the deck, tear it apart, move faster.",
      "Start your next experiment at 2 a.m."
    ],
    category: 'strategy',
    tags: ['competition', 'motivation']
  },
  {
    id: "q81",
    text: "You see your competitor launch on Product Hunt. You…",
    options: [
      "Track feedback and customer response.",
      "Send it to your team for analysis.",
      "Upvote it and say \"not bad.\"",
      "Launch your own product the next day with zero sleep."
    ],
    category: 'strategy',
    tags: ['competition', 'launch']
  },
  {
    id: "q82",
    text: "Your TTO delays your licensing agreement. You…",
    options: [
      "Ask for updates weekly.",
      "Offer legal support to move faster.",
      "Say \"It's fine\" and start building anyway.",
      "Re-incorporate offshore."
    ],
    category: 'ip',
    tags: ['tto', 'licensing']
  },
  {
    id: "q83",
    text: "A mentor asks, \"How will this ever make money?\" You…",
    options: [
      "Say, \"I'm still figuring that out.\"",
      "Talk about grants and partnerships.",
      "Say \"We'll find someone who knows how.\"",
      "Say \"It's pre-revenue… forever.\""
    ],
    category: 'strategy',
    tags: ['business-model', 'mentorship']
  },
  {
    id: "q84",
    text: "Your science gets scooped in a major journal. You…",
    options: [
      "Congratulate the authors and cite them.",
      "Rerun your version and post the data fast.",
      "Pivot and say yours was better anyway.",
      "Send their figure to your VC with 'We're still early... for now.'"
    ],
    category: 'academic',
    tags: ['competition', 'publication']
  },
  {
    id: "q85",
    text: "A VC you admire ignores your deck. You…",
    options: [
      "Follow up politely after a week.",
      "Ask for feedback from someone they funded.",
      "Cold intro them from a stealth alias.",
      "Print their logo on your dartboard."
    ],
    category: 'funding',
    tags: ['vc', 'rejection']
  },
  {
    id: "q86",
    text: "An angel investor offers $25K and nonstop opinions. You…",
    options: [
      "Accept with boundaries.",
      "Negotiate advisory involvement.",
      "Ghost them.",
      "Take the money and auto-filter their email to spam."
    ],
    category: 'funding',
    tags: ['angel', 'boundaries']
  },
  {
    id: "q87",
    text: "Your founding team wants to \"revisit roles.\" You…",
    options: [
      "Set up a structured convo and mediate.",
      "Use OKRs to realign expectations.",
      "Reassign titles while they're at lunch.",
      "Spin out a stealth company by Thursday."
    ],
    category: 'team',
    tags: ['roles', 'conflict']
  },
  {
    id: "q88",
    text: "Your investor wants weekly updates. You…",
    options: [
      "Send them, clearly and consistently.",
      "Ask if biweekly could work better.",
      "Create a fake update bot with GPT.",
      "Record a deepfake of yourself saying \"we're crushing it.\""
    ],
    category: 'funding',
    tags: ['investor-relations', 'communication']
  },
  {
    id: "q89",
    text: "You wake up to a cease and desist. You…",
    options: [
      "Call your lawyer.",
      "Review the claim and reply carefully.",
      "Print it and add it to your pitch deck.",
      "Tweet 'Cease? Never. Desist? Try me.'"
    ],
    category: 'ip',
    tags: ['legal', 'risk']
  },
  {
    id: "q90",
    text: "You finally get the term sheet you've been chasing. You…",
    options: [
      "Read every clause and celebrate.",
      "Review with a lawyer before signing.",
      "Sign it, post the doc emoji on Twitter.",
      "Tattoo the valuation on your forearm."
    ],
    category: 'funding',
    tags: ['term-sheet', 'fundraising']
  },
  {
    id: "q91",
    text: "Your PI warns you not to share slides outside the lab. You…",
    options: [
      "Thank them and delete the deck.",
      "Share it anyway, but watermark it.",
      "Send it to five friends with \"thoughts?\"",
      "Upload it to Twitter with the caption \"Free the data.\""
    ],
    category: 'academic',
    tags: ['confidentiality', 'sharing']
  },
  {
    id: "q92",
    text: "You get your first \"Yes\" from someone who wants to fund you. You…",
    options: [
      "Say thank you and send them your plan.",
      "Ask if they've funded science before.",
      "Reply \"Holy shit\" and panic for 30 minutes.",
      "Screenshot it, tweet it, and call your mom."
    ],
    category: 'funding',
    tags: ['investor', 'milestone']
  },
  {
    id: "q93",
    text: "Your TTO says, \"Let's wait to file the patent until it's published.\" You…",
    options: [
      "Nod. That makes sense.",
      "Ask for a meeting to understand timelines.",
      "Push to file anyway.",
      "File it yourself, under your name."
    ],
    category: 'ip',
    tags: ['patent', 'tto']
  },
  {
    id: "q94",
    text: "You're doing a seminar talk. Your slides crash. You…",
    options: [
      "Reboot and try again calmly.",
      "Narrate the content and keep going.",
      "Pull up your figures from Google Drive.",
      "Draw everything on the whiteboard and call it performance art."
    ],
    category: 'academic',
    tags: ['presentation', 'resilience']
  },
  {
    id: "q95",
    text: "Your investor wants weekly updates. You…",
    options: [
      "Send them, clearly and consistently.",
      "Ask if biweekly could work better.",
      "Create a fake update bot with GPT.",
      "Record a deepfake of yourself saying \"we're crushing it.\""
    ],
    category: 'funding',
    tags: ['investor-relations', 'communication']
  },
  {
    id: "q96",
    text: "Your founding team wants to \"revisit roles.\" You…",
    options: [
      "Set up a structured convo and mediate.",
      "Use OKRs to realign expectations.",
      "Reassign titles while they're at lunch.",
      "Spin out a stealth company by Thursday."
    ],
    category: 'team',
    tags: ['roles', 'conflict']
  },
  {
    id: "q97",
    text: "A journalist emails you for comment. You…",
    options: [
      "Reply promptly with talking points.",
      "Forward to your comms person.",
      "Say \"off record\" then spill too much.",
      "Demand they call you \"visionary renegade\" in the headline."
    ],
    category: 'strategy',
    tags: ['media', 'communication']
  },
  {
    id: "q98",
    text: "You're invited to a startup award you didn't apply for. You…",
    options: [
      "Attend—it's good exposure.",
      "Ask who's sponsoring and why.",
      "Use it in your next investor email.",
      "Decline and start your own award called \"Exit or Die.\""
    ],
    category: 'strategy',
    tags: ['recognition', 'marketing']
  },
  {
    id: "q99",
    text: "A junior scientist asks \"How do I get where you are?\" You…",
    options: [
      "Share your story with honesty.",
      "Offer to mentor if they're serious.",
      "Say \"Ignore most advice, including mine.\"",
      "Hand them your therapy bill and a pitch deck."
    ],
    category: 'academic',
    tags: ['mentorship', 'career']
  },
  {
    id: "q100",
    text: "You finally get the term sheet you've been chasing. You…",
    options: [
      "Read every clause and celebrate.",
      "Review with a lawyer before signing.",
      "Sign it, post the doc emoji on Twitter.",
      "Tattoo the valuation on your forearm."
    ],
    category: 'funding',
    tags: ['term-sheet', 'fundraising']
  }
];


// Function to get all questions
export const getInitialQuestions = (): SurveyQuestion[] => {
  return [...allQuestions];
};

// Function to get questions with the option to filter
export const getAllQuestions = (): SurveyQuestion[] => {
  return [...allQuestions];
};
