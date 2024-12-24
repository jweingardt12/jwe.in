'use client';
import { SimpleLayout } from '@/components/SimpleLayout';
import { Container } from '@/components/Container';
import { useEffect, useState } from 'react';
import Image from 'next/image'; // Import the Image component

const timeline = [
  {
    name: 'Cloudkitchens: Product Manager',
    description:
      'Nihil aut nam. Dignissimos a pariatur et quos omnis. Aspernatur asperiores et dolorem dolorem optio voluptate repudiandae.',
    date: '2021 - present',
    dateTime: '2021-08',
  },
  {
    name: 'Ritual: Regional GM',
    description:
      'Provident quia ut esse. Vero vel eos repudiandae aspernatur. Cumque minima impedit sapiente a architecto nihil.',
    date: '2017 - 2020',
    dateTime: '2021-12',
  },
  {
    name: 'Released beta',
    description:
      'Sunt perspiciatis incidunt. Non necessitatibus aliquid. Consequatur ut officiis earum eum quia facilis. Hic deleniti dolorem quia et.',
    date: 'Feb 2022',
    dateTime: '2022-02',
  },
  {
    name: 'Global launch of product',
    description:
      'Ut ipsa sint distinctio quod itaque nam qui. Possimus aut unde id architecto voluptatem hic aut pariatur velit.',
    date: 'Dec 2022',
    dateTime: '2022-12',
  },
];

function HeroSection() {
  const [visibleParts, setVisibleParts] = useState([false, false, false]);

  useEffect(() => {
    const timers = [
      setTimeout(() => setVisibleParts([true, false, false]), 200),
      setTimeout(() => setVisibleParts([true, true, false]), 1000),
      setTimeout(() => setVisibleParts([true, true, true]), 2500),
    ];

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, []);

  return (
    <Container className="mt-16 sm:mt-32">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
          <span
            className={`transition-opacity duration-300 ${
              visibleParts[0] ? 'opacity-100' : 'opacity-0'
            }`}
          >
            What&nbsp;I've&nbsp;done.
          </span>{' '}
          <span
            className={`transition-opacity duration-300 ${
              visibleParts[1] ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Where&nbsp;I've&nbsp;done&nbsp;it.
          </span>
          <span
            className={`block mt-2 relative transition-opacity duration-300 ${
              visibleParts[2] ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <span className="relative inline-block">
              Why it mattered.
              <span
                className={`absolute bottom-0 left-0 h-[8px] bg-orange-300/50 dark:bg-yellow-500/50 ${
                  visibleParts[2] ? 'animate-highlight delay-500' : 'opacity-0'
                }`}
              ></span>
            </span>
          </span>
        </h1>
        <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
          I've been lucky enough to work at some of the fastest-growing tech
          companies, where I've built products that changed industries and
          people’s lives.
        </p>
      </div>

      {/* Image Section */}
      <div className="mt-12 mx-auto max-w-2xl">
        <div className="rounded-xl bg-gray-900/5 p-2 ring-1 ring-gray-900/10 dark:ring-gray-700">
          <img
            alt="App screenshot"
            src="https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ffd97c08c-ff80-4bfb-9d76-5aad2413d17d_1600x890.png"
            className="w-full rounded-md shadow-2xl ring-1 ring-gray-900/10 dark:ring-gray-700"
            width={1600}
            height={890}
          />
        </div>
      </div>
    </Container>
  );
}
function TimelineSection() {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemClick = (index) => {
    setSelectedItem(selectedItem === index ? null : index);
  };

  return (
    <Container className="mt-16">
      <div className="flex max-w-3xl flex-col space-y-6">
        {timeline.map((item, index) => (
          <div key={index} className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 relative">
            <div
              className="cursor-pointer"
              onClick={() => handleItemClick(index)}
            >
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
                {item.name}
              </h3>
              <time
                className="block text-sm text-zinc-400 dark:text-zinc-500"
                dateTime={item.dateTime}
              >
                {item.date}
              </time>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {item.description}
              </p>
            </div>
            <div
              className={`absolute top-4 right-4 text-xl font-bold text-zinc-800 dark:text-zinc-100 cursor-pointer transition-transform duration-500 ease-in-out ${
                selectedItem === index ? 'rotate-25' : 'rotate-0'
              }`}
              onClick={() => handleItemClick(index)}
            >
              {selectedItem === index ? '×' : '+'}
            </div>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                selectedItem === index ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
              }`}
              style={{ transitionProperty: 'max-height, opacity' }}
            >
              <div className="mt-4 border-t border-gray-200 dark:border-gray-600 pt-4">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Detailed information about {item.name} goes here. You can include more content or even links.
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}


export default function Work() {
  return (
    <SimpleLayout>
      <HeroSection />
      <TimelineSection />
    </SimpleLayout>
  );
}