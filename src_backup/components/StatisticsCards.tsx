import React from 'react';

interface StatCard {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: {
        bg: string;
        text: string;
        iconBg: string;
        iconColor: string;
    };
}

interface StatisticsCardsProps {
    stats: {
        total: number;
        active: number;
        inactive: number;
        createdToday: number;
        recentActivity: number;
    };
    className?: string;
    onCardClick?: (cardType: string) => void;
}

const StatisticsCards = ({ stats, className = "", onCardClick }: StatisticsCardsProps) => {
    const statCards: StatCard[] = [
        {
            title: 'Today\'s Sales',
            value: stats.total,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
            ),
            color: {
                bg: 'from-indigo-50 to-purple-50 dark:from-indigo-200/20 dark:to-purple-100/10',
                text: 'text-indigo-900 dark:text-white',
                iconBg: 'bg-indigo-100 dark:bg-white/10',
                iconColor: 'text-indigo-600 dark:text-white'
            }
        },
        {
            title: 'Live Orders',
            value: stats.active,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            ),
            color: {
                bg: 'from-emerald-50 to-teal-50 dark:from-emerald-200/20 dark:to-teal-100/10',
                text: 'text-emerald-900 dark:text-white',
                iconBg: 'bg-emerald-100 dark:bg-white/10',
                iconColor: 'text-emerald-600 dark:text-white'
            }
        },
        {
            title: 'New Orders',
            value: stats.inactive,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: {
                bg: 'from-rose-50 to-pink-50 dark:from-rose-200/20 dark:to-pink-100/10',
                text: 'text-rose-900 dark:text-white',
                iconBg: 'bg-rose-100 dark:bg-white/10',
                iconColor: 'text-rose-600 dark:text-white'
            }
        },
        {
            title: 'Preparing',
            value: stats.createdToday,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: {
                bg: 'from-amber-50 to-orange-50 dark:from-amber-200/20 dark:to-orange-100/10',
                text: 'text-amber-900 dark:text-white',
                iconBg: 'bg-amber-100 dark:bg-white/10',
                iconColor: 'text-amber-600 dark:text-white'
            }
        },
        {
            title: 'Awaiting Pickup',
            value: stats.recentActivity,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            color: {
                bg: 'from-sky-50 to-blue-50 dark:from-sky-200/20 dark:to-blue-100/10',
                text: 'text-sky-900 dark:text-white',
                iconBg: 'bg-sky-100 dark:bg-white/10',
                iconColor: 'text-sky-600 dark:text-white'
            }
        }
    ];

    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-7 ${className}`}>
            {statCards.map((card, index) => (
                <div 
                    key={card.title}
                    onClick={() => onCardClick?.(card.title.toLowerCase())}
                    className={`border-0 shadow-xl bg-gradient-to-br ${card.color.bg} hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-xl min-h-[80px] cursor-pointer`}
                >
                    <div className="p-3 h-full">
                        <div className="flex flex-row items-center h-full min-h-[74px]">
                            <div className="flex flex-col justify-center flex-grow">
                                <p className={`text-sm font-semibold ${card.color.iconColor}`}>{card.title}</p>
                                <p className={`text-2xl font-bold ${card.color.text}`}>
                                    {card.title === 'Today\'s Sales' ? `₹${card.value.toLocaleString()}` : card.value}
                                </p>
                            </div>
                            <div className={`flex items-center justify-center p-2 ${card.color.iconBg} rounded-full ml-2`} style={{ alignSelf: 'center' }}>
                                <div className={card.color.iconColor}>
                                    {React.cloneElement(card.icon as React.ReactElement, { className: 'w-6 h-6' })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatisticsCards;
