import { WaitList } from '@app/types'
import { formatUrl } from '@lib/utils'
import { Card, CardContent, CardFooter, CardTitle } from '@shadcn/card'
import NextLink from 'next/link'

export function WaitlistCard(props: Pick<WaitList, 'name' | 'created_at'>) {
  const url = `/dashboard/${formatUrl(props.name)}/activities`

  return (
    <NextLink href={url}>
      <Card className="bg-inherit border-grayish text-white opacity-80 min-h-[200px] cursor-pointer">
        <CardFooter>
          <CardTitle className="truncate">{props.name}</CardTitle>
          <CardContent>
            <span>{props.created_at}</span>
          </CardContent>
        </CardFooter>
      </Card>
    </NextLink>
  )
}
