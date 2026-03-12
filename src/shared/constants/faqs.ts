export interface QuestionAnswer {
	question: string;
	answer: string;
}

export const FAQS = identity<QuestionAnswer[]>([
	{
		question: "How does OCPlace work?",
		answer: "In a limited time period, you can add or remove 1 part every 5 minutes to this obby. You can set "
			+ "properties before committing, but properties cannot be changed once added. All usual limitations of "
			+ "Obby Creator are in effect. Note that OCPlace have also imposed our own limitations to make the event "
			+ "spicier.",
	},
	{
		question: "What are the requirements for OCPlace?",
		answer: "Atleast the 5 likes badge on Obby Creator. Any real builder who's playing OCPlace certainly has "
			+ "this badge, this is to filter out bots and alt accounts.",
	},
	{
		question: "When is OCPlace?",
		answer: "2025",
	},
	{
		question: "What will be the ObbyID?",
		answer: "ImNotFireMan123#25. We will also port this over to any prospective game that OCPlace will birth — "
			+ "see 'Why?' for context.",
	},
	{
		question: "Who made OCPlace?",
		answer: "ImNotFireMan123 and GABA8. We both are the developers of Obby Creator Music and it's successor "
			+ "project, Roblaudio. We are not officially affiliated with mario118118, Obby Creator, or Whirlpool "
			+ "Studios.",
	},
	{
		question: "Why OCPlace?",
		answer: "<b>OCPlace is concerned by mario118118's continued neglect of Obby Creator.</b> For many, this game "
			+ "was a formative chapter in their game development journey, including our own. Many developers, birthed "
			+ "from Obby Creator, have parted their own ways to create their own amazing games. "
			+ "\n"
			+ "OCPlace wants to bring the community back together and showcase a prototype editor for a potential "
			+ "spiritual _successor to Obby Creator, but there is a more troubling issue that OCPlace shines light on."
			+ "\n"
			+ "Over recent years, mario118118 has significantly benefited from the community's neverending passion, "
			+ "but there has been little reinvestment into the game's future. Whether due to his part-time job, "
			+ "interest, or capacity, Obby Creator has been shelfed."
			+ "\n"
			+ "<b>If that means we must step in to revitalize Obby Creator, through custom audios via. Roblaudio, and "
			+ "now with OCPlace, we are ready to do so.</b>",
	},
	{
		question: "Where is multi-select/drag selection?",
		answer: "OCPlace enforces that parts are removed or added one by one. Multi-select goes against this and "
			+ "also encourages griefing builds by hypothetically drag-selecting and then deleting it.",
	},
	{
		question: "Where are the PreMades/Carts?",
		answer: "PreMades are low quality and spammy. Carts are hyperspecific and also spammy. OCPlace encourages "
			+ "people to have fun building, not using junk. Second, it isn't healthy (as if this project is healthy) "
			+ "to remake ~40 of the built-in PreMades by hand. Finally, OCPlace enforces that parts are removed or "
			+ "added one by one. People would rather spam PreMades, ultimately leading to a subpar obby.",
	},
	{
		question: "Will this be open sourced?",
		answer: "Yes, once the event conclues. OCPlace will be open sourced under the GitHub organization 'OCPlace'. "
			+ "The source code for the game will be over `OCPlace/ocplace-2025`. Historical data will be published "
			+ "over `OCPlace/ocplace-history-2025`.",
	},
	{
		question: "Will there be reruns?",
		answer: "Probably not. Depends on the community's demand. It also takes a bit of the novelty from a single "
			+ "event.",
	},
	{
		question: "Should you hire us? (For Whirlpool Studios)",
		answer: "Yes. You can see the source code and realize we are better programmers :)",
	},
]);
