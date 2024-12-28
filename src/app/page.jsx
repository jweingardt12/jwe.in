
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Container } from '@/components/Container';
import { Photos } from '@/components/Photos';
import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  ThreadsIcon,
} from '@/components/SocialIcons';

function SocialLink({ icon: Icon, ...props }) {
  return (
    <Link className="group -m-1 p-1" {...props}>
      <Icon className="h-6 w-6 fill-zinc-500 transition group-hover:fill-zinc-600 dark:fill-zinc-400 dark:group-hover:fill-zinc-300" />
    </Link>
  );
}

export default async function Home() {
  return (
    <>
      <Container className="mt-9">
        <div className="max-w-2xl">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
              Jason Weingardt
            </h1>
            <Image
              src="/src/images/avatar.jpg"
              alt="Jason Weingardt"
              width={150}
              height={150}
              className="mt-6 rounded-full"
              priority
            />
          </div>

          <div className="animate-fade-in delay-2s">
            <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
              I'm Jason, a product manager based in Washington. I'm the founder and CEO of Planetaria, where we develop
              technologies that empower regular people to explore space on their
              own terms.
            </p>

            <div className="mt-6 flex gap-6">
              <SocialLink href="#" aria-label="Follow on X" icon={ThreadsIcon} />
              <SocialLink
                href="#"
                aria-label="Follow on Instagram"
                icon={InstagramIcon}
              />
              <SocialLink
                href="#"
                aria-label="Follow on GitHub"
                icon={GitHubIcon}
              />
              <SocialLink
                href="#"
                aria-label="Follow on LinkedIn"
                icon={LinkedInIcon}
              />
            </div>
          </div>
        </div>
      </Container>

      <div className="animate-fade-in delay-2s">
        <Photos />
      </div>
    </>
  );
}
