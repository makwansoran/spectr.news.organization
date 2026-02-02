import Link from 'next/link';

export const metadata = {
  title: 'Subscribe | Spectr',
  description: 'Choose a plan. Monthly, Yearly, or Corporate.',
};

const PLANS = [
  { id: 'monthly', name: 'Monthly', price: '$9.99', period: '/month', description: 'Full access to all articles. Cancel anytime.', features: ['Unlimited articles', 'Newsletter', 'Cancel anytime'], cta: 'Start Monthly', highlighted: false },
  { id: 'yearly', name: 'Yearly', price: '$99', period: '/year', description: 'Best value. Save 17% vs monthly.', features: ['Everything in Monthly', '2 months free', 'Priority support'], cta: 'Start Yearly', highlighted: true },
  { id: 'corporate', name: 'Corporate', price: 'Custom', period: '', description: 'Team licenses, API access, and dedicated support.', features: ['Unlimited seats', 'API access', 'Dedicated account manager'], cta: 'Contact Sales', highlighted: false },
];

export default function SubscribePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-globalist-black md:text-4xl">Subscribe to Spectr</h1>
        <p className="mx-auto mt-2 max-w-xl text-globalist-gray-600">Unlock full access. Paywall-protected content for subscribers only.</p>
      </header>
      <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
        {PLANS.map((plan) => (
          <div key={plan.id} className={`relative flex flex-col rounded-lg border-2 bg-globalist-white p-6 ${plan.highlighted ? 'border-bloomberg-blue shadow-lg' : 'border-globalist-gray-200'}`}>
            {plan.highlighted && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-bloomberg-blue px-3 py-0.5 text-xs font-semibold text-white">Best value</span>}
            <h2 className="text-lg font-bold text-globalist-black">{plan.name}</h2>
            <p className="mt-2 text-2xl font-bold text-globalist-black">{plan.price}<span className="text-base font-normal text-globalist-gray-600">{plan.period}</span></p>
            <p className="mt-2 text-sm text-globalist-gray-600">{plan.description}</p>
            <ul className="mt-4 flex-1 space-y-2 text-sm text-globalist-gray-700">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-bloomberg-blue" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/sign-up"
              className={`mt-6 block w-full rounded py-3 text-center text-sm font-semibold transition-colors ${plan.highlighted ? 'bg-bloomberg-blue text-white hover:bg-blue-700 active:bg-blue-800' : 'border border-globalist-gray-300 text-globalist-black hover:bg-globalist-gray-200 active:bg-globalist-gray-300'}`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
