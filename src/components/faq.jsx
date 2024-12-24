import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react'
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/24/outline'
import { Container } from '@/components/Container'

const faqs = [
  {
    question: "What's the best thing about Switzerland?",
    answer:
      "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
  },
  // Add more FAQs here
]

export function FAQ() {
  return (
    <Container className="mt-24 md:mt-28">
      <div className="mx-auto max-w-4xl divide-y divide-zinc-100 dark:divide-zinc-700/40">
        <h2 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
          Frequently asked questions
        </h2>
        <dl className="mt-10 space-y-6 divide-y divide-zinc-100 dark:divide-zinc-700/40">
          {faqs.map((faq) => (
            <Disclosure as="div" key={faq.question} className="pt-6">
              {({ open }) => (
                <>
                  <dt>
                    <DisclosureButton className="flex w-full items-start justify-between text-left">
                      <span className="text-base font-semibold text-zinc-800 dark:text-zinc-100">
                        {faq.question}
                      </span>
                      <span className="ml-6 flex h-7 items-center">
                        {open ? (
                          <MinusSmallIcon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
                        ) : (
                          <PlusSmallIcon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
                        )}
                      </span>
                    </DisclosureButton>
                  </dt>
                  <DisclosurePanel as="dd" className="mt-2 pr-12">
                    <p className="text-base text-zinc-600 dark:text-zinc-400">
                      {faq.answer}
                    </p>
                  </DisclosurePanel>
                </>
              )}
            </Disclosure>
          ))}
        </dl>
      </div>
    </Container>
  )
}
