import { notFound, redirect } from 'next/navigation'
import compareAsc from 'date-fns/compareAsc'
import format from 'date-fns/format'
import { schedule } from '@/config/schedule'

import { PartnerHero } from '@/components/PartnerHero'
import { Separator } from '@/components/Separator'
import React from 'react'
import Image from 'next/image'
import clsx from 'clsx'
import { DropCard } from '@/components/DropCard'

const Page = async ({ params }: { params: { slug: string } }) => {
  const slug = params.slug
  const partner = await getPartner(slug)

  if (!partner) {
    notFound()
  }

  const { drop, otherDrops, name, icon } = partner

  return (
    <div>
      <main className="relative w-screen overflow-x-hidden">
        <PartnerHero partner={partner} />
        <section className="px-8 lg:px-[120px] font-text">
          <Separator />
          {drop.writeup.sections.map((section, index) => (
            <div
              key={section.heading}
              className="flex flex-col gap-6 md:gap-10 pt-6 md:pt-10 mx-auto max-w-[800px]"
            >
              <div
                className={clsx(
                  'relative w-full aspect-video ',
                  {
                    'order-3': index === 0,
                  },
                  {
                    'order-1': index !== 0,
                  }
                )}
              >
                <Image
                  src={section.image}
                  alt={`Image for ${section.heading}`}
                  fill
                />
              </div>
              {index === 0 ? (
                <h2 className="text-lg leading-8 md:text-[32px] md:leading-[180%] order-1">
                  {section.heading}
                </h2>
              ) : (
                <h3 className="text-lg leading-8 md:text-2xl md:leading-[180%] order-2">
                  {section.heading}
                </h3>
              )}
              {section.contents.map((content, contentIndex) => (
                <p
                  key={content}
                  className="text-neutral-600 leading-7"
                  style={{
                    order:
                      index === 0
                        ? contentIndex === 0
                          ? 2
                          : 4 + contentIndex
                        : 3 + contentIndex,
                  }}
                >
                  {content}
                </p>
              ))}
            </div>
          ))}
        </section>
        <section className="px-8 lg:px-[120px] mt-16 pb-10 lg:mt-20 lg:pb-20">
          <h2 className="sr-only">External Drops</h2>
          <ul className="flex flex-col gap-8 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {otherDrops.map((drop) => (
              <li key={drop.name}>
                <DropCard {...drop} partner={name} partnerIcon={icon} />
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  )
}

async function getPartner(slug: string) {
  const now = new Date().getTime()
  const today = format(new Date(now), 'yyyy-MM-dd')

  const date = Object.keys(schedule).find(
    (date) => schedule[date].slug === slug
  )

  if (!date) {
    return notFound()
  }

  const comparison = compareAsc(new Date(today), new Date(date))

  if (comparison < 0) {
    redirect('/#drops')
  }

  const partner = schedule[date]

  return partner
}

export default Page
