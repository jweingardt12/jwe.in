
import { SimpleLayout } from '@/components/SimpleLayout'

const timeline = [
  {
    name: 'Founded company',
    description:
      'Nihil aut nam. Dignissimos a pariatur et quos omnis. Aspernatur asperiores et dolorem dolorem optio voluptate repudiandae.',
    date: 'Aug 2021',
    dateTime: '2021-08',
  },
  {
    name: 'Secured $65m in funding',
    description:
      'Provident quia ut esse. Vero vel eos repudiandae aspernatur. Cumque minima impedit sapiente a architecto nihil.',
    date: 'Dec 2021',
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
]

export default function Work() {
  return (
    <SimpleLayout>
      <div className="space-y-20">
        <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
          <div className="flex max-w-3xl flex-col space-y-16">
            {timeline.map((item, itemIdx) => (
              <article key={itemIdx} className="md:grid md:grid-cols-4 md:items-baseline">
                <div className="md:col-span-3 group relative flex flex-col items-start">
                  <h3 className="text-base font-semibold tracking-tight text-zinc-800 dark:text-zinc-100">
                    {item.name}
                  </h3>
                  <time className="md:hidden relative z-10 order-first mb-3 flex items-center text-sm text-zinc-400 dark:text-zinc-500" dateTime={item.dateTime}>
                    {item.date}
                  </time>
                  <p className="relative z-10 mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {item.description}
                  </p>
                </div>
                <time className="mt-1 hidden md:block relative z-10 mb-3 flex items-center text-sm text-zinc-400 dark:text-zinc-500" dateTime={item.dateTime}>
                  {item.date}
                </time>
              </article>
            ))}
          </div>
        </div>
      </div>
    </SimpleLayout>
  )
}
