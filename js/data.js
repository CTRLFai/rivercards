// River + Rail TCG: card data, study content and odds.
// Set 1 (Module 1): "Groundbreaking". Content is drawn from the syllabus readings
// (OpenStax Entrepreneurship ch. 1, 2, 5 and the Getting Started as an Entrepreneur wikibook).

window.RR = window.RR || {};

RR.SETS = {
  M1: { code: 'M1', name: 'Groundbreaking', module: 'Module 1: Entrepreneurship', size: 18, color: '#1fb6c9' }
};

// type: concept | person | asset | threat
// rarity: C | U | R | L  (common, uncommon, rare, legendary)
// art: scene key in art.js
// text: game text (used by battles later). learn: plain-language meaning. flavor: italic line.
// q: mastery question [prompt, [choices], correctIndex]
RR.CARDS = [
  // ---------- Commons ----------
  { id:'M1-001', set:'M1', no:1, name:'Market Demand', type:'concept', sub:'Opportunity', rarity:'C', cost:1, art:'demand',
    text:'Reveal the top Threat. If it is Low Sales, it loses 2 Power.',
    learn:'People will pay to solve this problem. The first of three tests an idea must pass to become an opportunity.',
    flavor:'"Nobody buys a solution to a problem they don\'t have."',
    q:['In the opportunity test, "market demand" means:',['The market is large','People will pay to solve the problem','Margins are high','Competitors exist'],1] },
  { id:'M1-002', set:'M1', no:2, name:'Market Size', type:'concept', sub:'Opportunity', rarity:'C', cost:1, art:'size',
    text:'Draw a card. If you control a Person, draw 2 instead.',
    learn:'There are enough buyers, the market can grow, and barriers to entry are manageable.',
    flavor:'Count the boats before you buy the trailer.',
    q:['Which belongs to "market structure and size"?',['Growth potential and barriers to entry','Profit per job','Your passion for the idea','Your logo'],0] },
  { id:'M1-003', set:'M1', no:3, name:'Healthy Margins', type:'concept', sub:'Opportunity', rarity:'C', cost:2, art:'margins',
    text:'Gain 2 Capital. Gain 2 more if a Threat is in play.',
    learn:'Profit per sale is high enough to justify your time, risk, startup capital and the work of delivering.',
    flavor:'Busy is not the same as profitable.',
    q:['"Margins and resources" asks whether:',['Profit justifies the time, risk and capital','The market is growing','Customers feel pain','You have a team'],0] },
  { id:'M1-004', set:'M1', no:4, name:'Customer Pain', type:'concept', sub:'Need', rarity:'C', cost:1, art:'pain',
    text:'Target Person gains +20 HP this turn.',
    learn:'The specific problem customers most want fixed. A product with no real pain behind it rarely sells.',
    flavor:'Find the itch before you sell the scratcher.',
    q:['Why does customer pain matter?',['It sets your price','Without a real need a product rarely sells','It lowers costs','It replaces research'],1] },
  { id:'M1-005', set:'M1', no:5, name:'Secondary Research', type:'concept', sub:'Research', rarity:'C', cost:1, art:'secondary',
    text:'Look at the top 3 cards of the Threat deck. Put them back in any order.',
    learn:'Using data that already exists: reports, articles, census data. Fast and cheap, but rarely specific to your idea.',
    flavor:'The library opens before the customer does.',
    q:['Secondary research is:',['Interviews you run','Data that already exists','A focus group','A secret shopper'],1] },
  { id:'M1-006', set:'M1', no:6, name:'Side Venture', type:'concept', sub:'Pathway', rarity:'C', cost:1, art:'side',
    text:'Your next card costs 1 less. You cannot lose more than 1 HP this turn.',
    learn:'Starting the business on the side while keeping your job, to limit risk while you test it.',
    flavor:'Nights and weekends, for now.',
    q:['Why start a venture on the side?',['To limit risk while testing','To avoid taxes','To raise investor money','To skip research'],0] },
  { id:'M1-007', set:'M1', no:7, name:'Job Shop Welder', type:'person', sub:'Fabrication', rarity:'C', hp:60, art:'welder',
    moves:[{name:'Grind It Down', cost:1, dmg:'20', text:''},{name:'Weld Prep Backlog', cost:2, dmg:'40', text:'Lose 10 HP from frustration.'}],
    weak:'Downtime', resist:'Sales Pitch', retreat:1,
    learn:'A likely River + Rail buyer: fab shops spend hours on surface prep before welding and coating.',
    flavor:'Every hour on a grinder is an hour not welding.',
    q:['What does a fab shop buyer use today instead of laser cleaning?',['Grinders and wire wheels','Nothing, prep is skipped','Robots','Laser welders'],0] },
  { id:'M1-008', set:'M1', no:8, name:'Wire Wheel', type:'asset', sub:'Status Quo', rarity:'C', cost:1, art:'wirewheel',
    text:'Opposing Persons have Resist +10 while Wire Wheel is in play.',
    learn:'The cheap tool customers already own. Your real competition is often the habit, not another company.',
    flavor:'Cheap, loud, and already in the drawer.',
    q:['A competitor that is "the status quo" means:',['A rival laser company','What customers already do today','A government rule','A new startup'],1] },

  // ---------- Uncommons ----------
  { id:'M1-009', set:'M1', no:9, name:'Primary Research', type:'concept', sub:'Research', rarity:'U', cost:2, art:'primary',
    text:'Choose a Threat. Its weakness is revealed for the rest of the game.',
    learn:'Gathering new data yourself: interviews, surveys, focus groups. Costs more but answers your specific questions.',
    flavor:'Reports tell you what people buy. Interviews tell you why.',
    q:['Which is primary research?',['An industry report','Census data','Interviewing boatyard managers','A trade magazine'],2] },
  { id:'M1-010', set:'M1', no:10, name:'Creative Destruction', type:'concept', sub:'Theory', rarity:'U', cost:3, art:'destruction',
    text:'Destroy target Asset. Its controller draws a card.',
    learn:'Schumpeter\'s idea: new innovations disrupt old ways of doing things, and that disruption opens new opportunities.',
    flavor:'The blasting cabinet didn\'t see it coming.',
    q:['"Creative destruction" was described by:',['Peter Drucker','Joseph Schumpeter','Adam Smith','Steve Jobs'],1] },
  { id:'M1-011', set:'M1', no:11, name:'Boatyard Manager', type:'person', sub:'Marine', rarity:'U', hp:80, art:'boatyard',
    moves:[{name:'Haul Out', cost:1, dmg:'30', text:''},{name:'Bottom Paint Season', cost:3, dmg:'70', text:'Only usable in spring.'}],
    weak:'Rain Delay', resist:'Cold Call', retreat:2,
    learn:'A seasonal, recurring buyer. How often a customer needs you matters as much as whether they need you.',
    flavor:'Every hull comes out of the river eventually.',
    q:['Why does purchase frequency matter in an opportunity assessment?',['It sets your logo','Recurring need means recurring revenue','It lowers taxes','It replaces pricing'],1] },
  { id:'M1-012', set:'M1', no:12, name:'Low Sales', type:'threat', sub:'Failure Mode', rarity:'U', pwr:3, res:2, art:'lowsales',
    text:'At the start of your turn, lose 1 Capital.',
    weakTo:'Market Demand',
    learn:'The most common reason small businesses fail. Usually traced back to weak demand or weak selling.',
    flavor:'The phone that doesn\'t ring.',
    q:['Which is listed as a top reason small businesses fail?',['Low sales','Too many customers','Low rent','Strong margins'],0] },
  { id:'M1-013', set:'M1', no:13, name:'Insufficient Capital', type:'threat', sub:'Failure Mode', rarity:'U', pwr:4, res:1, art:'capital',
    text:'Cards cost 1 more while this is in play.',
    weakTo:'Side Venture',
    learn:'Running out of money before the business pays for itself. Startup funding has to carry you to breakeven.',
    flavor:'The laser is paid off. The rent isn\'t.',
    q:['Startup funding must carry the business to:',['Its first sale','Breakeven','Its first hire','Year five'],1] },

  // ---------- Rares ----------
  { id:'M1-014', set:'M1', no:14, name:'The Opportunity Triad', type:'concept', sub:'Framework', rarity:'R', cost:4, art:'triad',
    text:'If you have played Market Demand, Market Size and Healthy Margins this game, win the encounter.',
    learn:'An idea becomes an opportunity only when all three overlap: demand, market size and structure, and margins and resources.',
    flavor:'One circle is a hobby. Three is a business.',
    q:['An idea becomes an opportunity when:',['Any one test is met','All three tests overlap','Investors agree','You have a prototype'],1] },
  { id:'M1-015', set:'M1', no:15, name:'Fiber Laser Cleaner', type:'asset', sub:'Equipment', rarity:'R', cost:3, art:'laser',
    text:'Once per turn: deal 30 damage to a Threat. Deal 60 instead if it is Rust.',
    learn:'The core tool. Equipment is a resource question: can margins justify what it costs to own and run?',
    flavor:'Light in. Rust out.',
    q:['Owning expensive equipment is mainly tested by which opportunity question?',['Market demand','Margins and resources','Social value','Timing'],1] },
  { id:'M1-016', set:'M1', no:16, name:'Rushed Launch', type:'threat', sub:'Failure Mode', rarity:'R', pwr:5, res:3, art:'rushed',
    text:'When this enters, discard a Research card from your hand.',
    weakTo:'Primary Research',
    learn:'Launching to hit a deadline while ignoring what customers said they need. Apple\'s Newton is the classic case.',
    flavor:'It shipped on time. Nobody wanted it.',
    q:['The Apple Newton failed mainly because Apple:',['Had no research','Rushed launch and ignored known customer needs','Priced it too low','Had no handwriting recognition'],1] },
  { id:'M1-017', set:'M1', no:17, name:'The Insider', type:'person', sub:'Founder', rarity:'R', hp:100, art:'insider',
    moves:[{name:'Knows the Gaps', cost:2, dmg:'50', text:'Reveal a Threat\'s weakness.'},{name:'Trusted Voice', cost:3, dmg:'80', text:''}],
    weak:'Blind Spots', resist:'Skepticism', retreat:1,
    learn:'A founder with firsthand experience of the market sees gaps others miss and is treated as an insider, not a salesperson.',
    flavor:'Spent ten years on the other side of the counter.',
    q:['Why do insiders have an edge?',['They get loans faster','They understand customers and see gaps','They pay less tax','They need no research'],1] },

  // ---------- Legendary ----------
  { id:'M1-018', set:'M1', no:18, name:'Opportunity Entrepreneur', type:'person', sub:'Legend', rarity:'L', hp:150, art:'founder',
    moves:[{name:'Spot the Gap', cost:2, dmg:'60', text:'Search your deck for a Concept.'},{name:'Creative Destruction', cost:4, dmg:'140', text:'Destroy all Assets in play.'}],
    weak:'Burnout', resist:'Necessity', retreat:2,
    learn:'Entrepreneurs start from necessity, opportunity, or both. Opportunity entrepreneurs start from what customers and markets want, and keep that focus.',
    flavor:'Fail fast, recover fast, and only make new mistakes.',
    q:['Entrepreneurial pathways come from:',['Necessity, opportunity, or both','Only opportunity','Only funding','Only education'],0] }
];

// Signature cards: earned only by graded exercises (redeem codes from chat). Never in packs.
RR.SIGNATURES = {
  M1: { id:'M1-S', set:'M1', no:'S', name:'Opportunity Memo', type:'signature', sub:'Your Work', rarity:'S', art:'memo',
        learn:'Your graded Module 1 deliverable: every River + Rail segment scored, top 3 picked.',
        flavor:'Written by Mike. Graded by a tough professor.' }
};

RR.RARITY = {
  C:{ name:'Common', sym:'●', capital:5, foilCost:20 },
  U:{ name:'Uncommon', sym:'◆', capital:10, foilCost:40 },
  R:{ name:'Rare', sym:'★', capital:25, foilCost:100 },
  L:{ name:'Legendary', sym:'✦', capital:100, foilCost:300 },
  S:{ name:'Signature', sym:'✪', capital:0, foilCost:0 }
};

// Published odds (shown in the app).
RR.ODDS = {
  cardsPerPack: 5,
  slots: 'Cards 1 to 3: Common. Card 4: Uncommon. Card 5: Rare (85%) or Legendary (15%).',
  foil: 0.12,            // any card can be foil
  godPack: 0.02,         // every card foil
  legendaryPity: 6,      // a Legendary is guaranteed by your 6th pack without one
  premium: 'Premium packs: card 5 is always a foil Rare or better.'
};

// ---------- Study: Module 1 ----------
RR.STUDY = {
  M1: {
    title:'Module 1: Entrepreneurship',
    blurb:'Finding and testing an opportunity. Every pack you open here is a concept you just learned.',
    target:'2026-12-15',
    readings:[
      { id:'r-ent1', title:'ENT ch. 1: The Entrepreneurial Perspective', url:'https://openstax.org/books/entrepreneurship/pages/1-introduction',
        qs:[
          ['Why do some people start a venture on the side while keeping a full-time job?',['To limit risk','To avoid paperwork','To qualify for grants','To skip planning'],0],
          ['In the chapter, a vision for most ventures eventually includes:',['Never selling','Selling or harvesting the business','Going public','Hiring 100 people'],1],
          ['Disruptive technologies are described as:',['Existing technology applied in new ways','Always brand-new inventions','Government programs','Only software'],0]
        ]},
      { id:'r-ent2', title:'ENT ch. 2: The Entrepreneurial Journey and Pathways', url:'https://openstax.org/books/entrepreneurship/pages/2-introduction',
        qs:[
          ['The entrepreneurial process runs from:',['Funding to IPO','Ideation, to creating the venture, to harvesting it','Hiring to firing','Marketing to sales'],1],
          ['A path into entrepreneurship can come from:',['Necessity, opportunity, or both','Only opportunity','Only inheritance','Only a degree'],0],
          ['The process should adapt until the venture:',['Wins an award','Fits the market well enough to pay off your investment','Has a logo','Gets press'],1]
        ]},
      { id:'r-ent5', title:'ENT ch. 5: Identifying Entrepreneurial Opportunity', url:'https://openstax.org/books/entrepreneurship/pages/5-introduction',
        qs:[
          ['Entrepreneurial opportunity exists when:',['You have a great idea','Consumer demand meets the feasibility of delivering it','A competitor fails','Funding is available'],1],
          ['Which is NOT one of the three opportunity tests?',['Market demand','Market structure and size','Margins and resources','A finished logo'],3],
          ['A SWOT, PEST or competitive grid is used for:',['Competitive analysis','Bookkeeping','Hiring','Pricing only'],0]
        ]},
      { id:'r-wiki1', title:'Wikibook ch. 1: Opportunity', url:'https://biz.libretexts.org/Bookshelves/Business/Entrepreneurship/Getting_Started_as_an_Entrepreneur_(Wikibook)/01%3A_Opportunity',
        qs:[
          ['The core test of a good business idea is:',['It is new','Someone pays more than it costs to produce','It is patented','Friends like it'],1],
          ['An idea becomes an opportunity when it is attractive, durable, timely and:',['Patented','Anchored in something that adds value for the end user','Cheap','Venture-backed'],1],
          ['The PalmPilot beat the Apple Newton mostly by:',['Being first','Responding to what customers needed','Spending more on ads','Having more features'],1]
        ]},
      { id:'r-wiki2', title:'Wikibook ch. 2: Market', url:'https://biz.libretexts.org/Bookshelves/Business/Entrepreneurship/Getting_Started_as_an_Entrepreneur_(Wikibook)/02%3A_Market',
        qs:[
          ['Your picture of the "typical customer" should be:',['Trusted as-is','Tested against reality and revised','Kept secret','Based on yourself'],1],
          ['Market research is:',['Guessing what sells','Systematic gathering and analysis of market data','Advertising','A sales script'],1],
          ['If customers don\'t match your profile, you should be ready to revise:',['Only the price','Both the customer profile and the product','Nothing','Only the logo'],1]
        ]},
      { id:'r-wiki3', title:'Wikibook ch. 3: Team', url:'https://biz.libretexts.org/Bookshelves/Business/Entrepreneurship/Getting_Started_as_an_Entrepreneur_(Wikibook)/03%3A_Team', reflect:true },
      { id:'r-wiki4', title:'Wikibook ch. 4: Plan', url:'https://biz.libretexts.org/Bookshelves/Business/Entrepreneurship/Getting_Started_as_an_Entrepreneur_(Wikibook)/04%3A_Plan', reflect:true },
      { id:'r-wiki5', title:'Wikibook ch. 5: Company', url:'https://biz.libretexts.org/Bookshelves/Business/Entrepreneurship/Getting_Started_as_an_Entrepreneur_(Wikibook)/05%3A_Company', reflect:true },
      { id:'r-wiki6', title:'Wikibook ch. 6: Money', url:'https://biz.libretexts.org/Bookshelves/Business/Entrepreneurship/Getting_Started_as_an_Entrepreneur_(Wikibook)/06%3A_Money', reflect:true }
    ],
    quiz:[
      ['Entrepreneurial opportunity is the point where:',['An idea is patented','Consumer demand meets feasibility','Funding arrives','A competitor exits'],1],
      ['Which is primary research for River + Rail?',['A laser industry report','Census data on Jacksonville','Calling 5 fab shops about their prep work','A trade magazine'],2],
      ['Secondary research is best described as:',['Fast and cheap but often not specific','Slow but exact','Illegal','Only surveys'],0],
      ['A fab shop that preps with grinders today shows that your real competition is often:',['Other laser companies','The status quo','The government','Suppliers'],1],
      ['Which is one of the three opportunity tests?',['Brand awareness','Significant margins and resources','A business plan','A website'],1],
      ['"Creative destruction" refers to:',['Innovation disrupting old ways and opening opportunities','Breaking equipment','Bankruptcy law','Marketing stunts'],0],
      ['Which is listed among top reasons small businesses fail?',['Insufficient capital','Too much demand','Low rent','Good location'],0],
      ['Startup funding has to carry a business to:',['Its first ad','Breakeven','Its first award','Five employees'],1],
      ['A founder who used to work in the market they now serve has an edge because:',['They get cheaper loans','They understand customers and see gaps','They skip research','They need no capital'],1],
      ['Apple\'s Newton is a lesson in:',['Rushing launch while ignoring customer needs','Pricing too low','Too much research','Patents'],0],
      ['How often a customer needs you (frequency) matters because:',['It drives recurring revenue','It sets your logo','It replaces demand','It lowers capital needs to zero'],0],
      ['The entrepreneurial process ends with:',['Ideation','Harvesting the venture','Hiring','Market research'],1],
      ['Entrepreneurial pathways come from:',['Necessity, opportunity, or both','Only opportunity','Only luck','Only family money'],0],
      ['Big ideas usually aim at efficiency, effectiveness, or:',['Innovation','Advertising','Litigation','Taxes'],0],
      ['"Effectiveness" means:',['Doing things right','Doing the right thing','Doing things cheaply','Doing things fast'],1],
      ['Before committing to an idea, the wikibook says to get feedback from:',['Only friends','Many people, including critics','Nobody','Only investors'],1],
      ['Testing an idea while it is still rough means:',['Waiting for perfection','Cheap prototypes and real-world tests','Hiring a big team','Raising money first'],1],
      ['A boatyard that hauls out every spring is an example of:',['Seasonal, recurring demand','No demand','A failure mode','Secondary research'],0],
      ['Market structure and size includes:',['Growth potential and barriers to entry','Your hourly rate','Your logo','Your passion'],0],
      ['The ten screening questions include "time to first sale" and:',['Time to profitability','Logo color','Office size','Team photos'],0]
    ],
    exercise:'Write an opportunity assessment for each River + Rail segment (fabrication, plant maintenance, auto restoration, fire/smoke restoration, masonry, rail/port coatings, boatyards): who pays, what they use today, how often, how you\'d reach them. Score them, pick the top 3, and write it up as a one-page memo. Submit it in your Module 1 chat for a grade and a redeem code.'
  }
};
