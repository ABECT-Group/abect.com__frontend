'use client';

import { JSX } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import './AboutTeam.scss';

export default function AboutTeam(): JSX.Element {
	const t = useTranslations('AboutPage');

	const team = [
		{
			name: t('team.member1.name'),
			position: t('team.member1.position'),
			description: t('team.member1.description'),
			tags: ['Node.js', 'React', 'MongoDB', 'Next.js', 'FinTech APIs'],
			image: '/images/team/team1.webp',
			isFounder: true
		},
		{
			name: t('team.member2.name'),
			position: t('team.member2.position'),
			description: t('team.member2.description'),
			tags: ['Figma', 'UI/UX', 'Prototyping', 'Web Design'],
			image: '/images/team/team2.webp',
			isFounder: false
		},
		{
			name: t('team.member4.name'),
			position: t('team.member4.position'),
			description: t('team.member4.description'),
			tags: ['Project Management', 'Client Relations', 'Agile', 'Coordination'],
			image: '/images/team/team3.webp',
			isFounder: false
		},
		{
			name: t('team.member3.name'),
			position: t('team.member3.position'),
			description: t('team.member3.description'),
			tags: ['Social Media', 'Content Strategy', 'Analytics', 'Automation'],
			image: '/images/team/team4.webp',
			isFounder: false
		}
	];

	return (
		<section className="about-team">
			<h2 className="about-team__title">{t('team.title')}</h2>
			<p className="about-team__subtitle">{t('team.subtitle')}</p>

			<div className="about-team__grid">
				{team.map((member, index) => (
					<div
						key={index}
						className={`about-team__card ${member.isFounder ? 'about-team__card--founder' : ''}`}
					>
						<div className="about-team__image">
							<Image
								src={member.image}
								alt={member.name}
								width={300}
								height={300}
								className="about-team__photo"
							/>
						</div>
						<div className="about-team__info">
							<h3 className="about-team__name">{member.name}</h3>
							<p className="about-team__position">{member.position}</p>
							<p className="about-team__description">{member.description}</p>
							<div className="about-team__tags">
								{member.tags.map((tag, tagIndex) => (
									<span key={tagIndex} className="about-team__tag">
										{tag}
									</span>
								))}
							</div>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
