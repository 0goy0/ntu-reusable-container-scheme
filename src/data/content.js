// All proposal text and figures in one place: edit wording here, not in the components.
// Source: CC0006 Abstract & Proposal.pdf. The $3 deposit is a group decision.
// Items marked [DRAFTED] are NOT in the proposal. The AI drafted them for the pitch; review before presenting.

export const TITLE = 'NTU Reusable Container Scheme';
export const SHORT_TITLE = 'Reusable Container Scheme';
export const DEPOSIT = 3;

export const HERO = {
  kicker: 'CC0006 · A proposal for NTU canteens',
  headline: ['Takeaway,', 'without the throwaway.'],
  lead: `A deposit-based network of reusable containers across NTU canteens, so students who forget their own container still have a reusable option. Borrow at any machine, return to any canteen, and get your $${DEPOSIT} back.`
};

export const COSTS = { container: 3, utensils: 1.5, wash: 0.05, disposable: 0.13 };
export const SET_COST = COSTS.container + COSTS.utensils;                  // $4.50
export const BREAK_EVEN = SET_COST / (COSTS.disposable - COSTS.wash);     // ≈ 56.25 uses

// "At a glance" summary, straight from the proposal. `ask` is [DRAFTED] from the Implementation section.
export const GLANCE = [
  { icon: 'trash', label: 'The problem', text: 'Takeaway meals create large amounts of single-use packaging, and BYOC only works for students who remember their container.' },
  { icon: 'repeat', label: 'The solution', text: `Borrow a durable container and stainless-steel utensils for a $${DEPOSIT} refundable deposit, and return them at any participating canteen.` },
  { icon: 'coins', label: 'The economics', text: `$${SET_COST.toFixed(2)} per reusable set. It beats $${COSTS.disposable.toFixed(2)} disposables after about ${Math.ceil(BREAK_EVEN)} uses, including washing.` },
  { icon: 'leaf', label: 'The impact', text: '59% lower climate-change impact after 20 uses, compared with single-use packaging (Aggarwal, 2024).' }
];
export const ASK = 'We are asking for approval to run a pilot at participating canteens, measured against clear KPIs.';

export const PROBLEM_POINTS = [
  { title: 'Single-use packaging piles up.', text: 'Every takeaway meal generates single-use food packaging waste.' },
  { title: 'BYOC depends on memory.', text: 'Bring-Your-Own-Container initiatives only work when students remember to bring one.' },
  { title: 'Forgetting leaves no alternative.', text: 'Students who forget their container have no reusable option today.' }
];

export const STEPS = [
  { title: 'Borrow', text: `Pay a refundable $${DEPOSIT} deposit at the machine and collect a container with stainless-steel utensils.` },
  { title: 'Order', text: 'Hand the container to the stall, which packs the takeaway meal in it.' },
  { title: 'Return', text: 'Drop it at any participating canteen. OmniBus shows the nearest machine that still has space.' },
  { title: 'Refund', text: `The $${DEPOSIT} deposit is refunded the moment the container is returned.` },
  { title: 'Wash & redistribute', text: 'Canteens clean containers in commercial dishwashers and redistribute them to where stock is low.' }
];

// Limitations come from the proposal. Each `mitigation` is [DRAFTED].
export const RISKS = [
  { icon: 'wallet', title: 'High initial cost', text: 'Upfront investment in reusable containers and utensils.',
    mitigation: `Start with a small pilot. The $${DEPOSIT} deposit recovers most of the $${SET_COST.toFixed(2)} set cost, so the loss on any unreturned set is small.` },
  { icon: 'undo', title: 'Low return rates', text: 'Unreturned containers raise replacement costs and reduce the environmental benefit.',
    mitigation: 'The deposit is a direct incentive to return, OmniBus points to the nearest machine with space, and the return rate is tracked as a pilot KPI.' },
  { icon: 'droplets', title: 'More washing', text: 'Additional water, electricity and possibly manpower.',
    mitigation: 'Use existing commercial dishwashers on full loads, and measure actual washing costs during the pilot before scaling.' },
  { icon: 'truck', title: 'Redistribution', text: 'Containers need to be moved between canteens frequently.',
    mitigation: 'Live machine-capacity data shows which canteens are running low, so containers can be moved in planned batches rather than ad hoc.' },
  { icon: 'shield', title: 'Hygiene perception', text: 'Users may feel containers are not cleaned properly.',
    mitigation: 'Commercial-grade washing, clean-stock storage inside the machines, and a hygiene question in the end-of-pilot survey.' }
];

export const PILOT_STEPS = [
  { title: 'Launch', text: 'Run the scheme at a small set of participating canteens.' },
  { title: 'Measure', text: 'Track usage, returns, losses and real costs throughout.' },
  { title: 'Survey', text: 'Gather feedback from canteen users, stall owners and staff.' },
  { title: 'Refine & scale', text: 'Modify the system based on the findings, then expand.' }
];

export const KPIS = [
  ['arrowUpRight', 'Containers borrowed'],
  ['undo', 'Containers returned'],
  ['repeat', 'Average reuses per container'],
  ['alert', 'Damaged or lost containers'],
  ['coins', 'Actual washing & replacement costs'],
  ['trendingDown', 'Reduction in takeaway containers used']
];

export const OUTCOMES = [
  'Less single-use takeaway packaging.',
  'Reusable packaging within reach, even for those who forget.',
  'Sustainable habits through regular borrowing and returning.',
  'A lower environmental impact and carbon footprint from canteens.'
];

// Fill in your names here; they appear in the footer.
// Each name must be in quotes, separated by commas, e.g. ['Nicholas', 'Alex Tan', 'Priya'].
export const GROUP_MEMBERS = ['Nicholas', 'Vanessa', 'Joelle', 'Xin Hui', 'Ean Yue', 'Brennen'];

// APA 7th edition.
export const REFERENCES = [
  {
    text: 'Aggarwal, R. (2024). Comparative life cycle assessment of reusable and single use take-away lunch boxes used in student restaurants. Cleaner Environmental Systems, 14, 100223.',
    doi: 'https://doi.org/10.1016/j.cesys.2024.100223'
  }
];
