import { Card } from '@workspace/ui/components/card';
import { Calculator, FileCheck, HeadphonesIcon, Shield, TrendingUp, Wallet } from 'lucide-react';

const services = [
	{
		icon: Wallet,
		title: 'Plan Management',
		description:
			'Complete financial administration of your NDIS plan, ensuring every dollar is tracked and accounted for.',
	},
	{
		icon: Calculator,
		title: 'Budget Tracking',
		description:
			'Real-time budget monitoring and reporting so you always know where your funding stands.',
	},
	{
		icon: FileCheck,
		title: 'Provider Payments',
		description:
			'Timely payment processing to your chosen service providers, removing the hassle from your plate.',
	},
	{
		icon: TrendingUp,
		title: 'Funding Optimization',
		description:
			'Expert guidance to help you maximize your NDIS funding and achieve better outcomes.',
	},
	{
		icon: Shield,
		title: 'Compliance & Security',
		description:
			'NDIS-compliant processes with bank-level security to protect your sensitive information.',
	},
	{
		icon: HeadphonesIcon,
		title: '24/7 Support',
		description:
			'Dedicated support team ready to answer your questions and help you navigate your plan.',
	},
];

export function ServicesSection() {
	return (
		<section id="services" className="border-b py-20 sm:py-28">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-2xl text-center">
					<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
						Comprehensive NDIS Plan Management
					</h2>
					<div className="mt-6 h-1 w-24 bg-primary mx-auto"></div>
					<p className="mt-6 text-lg text-muted-foreground">
						Everything you need to manage your NDIS funding efficiently and effectively, all in one
					 place.
					</p>
				</div>

				<div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{services.map((service) => (
						<Card
							key={service.title}
							className="group relative overflow-hidden p-6 transition-all hover:shadow-lg"
						>
							<div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
								<service.icon className="h-6 w-6" />
							</div>
							<h3 className="mb-2 text-xl font-semibold">{service.title}</h3>
							<p className="text-muted-foreground">{service.description}</p>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}
