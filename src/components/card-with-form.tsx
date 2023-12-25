'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@shadcn/card'
import { Switch } from '@shadcn/switch'
import { createWaitlist } from '@action'
import { Input } from '@shadcn/input'
import { Label } from '@shadcn/label'
import { Create } from '@components/create-button'
import { revalidatePath } from 'next/cache'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import * as React from 'react'

type Fields = {
  email: boolean
  name: boolean
}

interface CardWithFormProps {
  email: string
  url: string
}

export function CardWithForm({ email, url }: CardWithFormProps) {
  const [fields, setFields] = React.useState<Fields>({
    email: true,
    name: true
  })

  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)

  const path = searchParams.get('url')

  const pathname = usePathname()
  const { replace, push } = useRouter()

  function handleUpdate(term: string) {
    term ? params.set('url', term) : params.delete('url')
    replace(`${pathname}?${params.toString()}`)
  }

  function handleUpdateFields() {
    setFields(prevFields => ({
      ...prevFields,
      email: !prevFields.email,
      name: !prevFields.name
    }))
    !fields.email ? params.set('email', 'true') : params.delete('email')
    !fields.name ? params.set('name', 'true') : params.delete('name')
    replace(`${pathname}?${params.toString()}`)
  }

  async function create(formdata: FormData) {
    const name = formdata.get('name')

    if (!name) return

    const create_waitlist = await createWaitlist(email, url)

    if (!create_waitlist?.table_creation_error) {
      alert('Sorry, An error occured')
    } else {
      push('/dashboard')
      return revalidatePath('/dashboard')
    }
  }

  return (
    <Card className="bg-[#1A1A17] text-white opacity-90 p-8 border-none flex flex-col gap-4 w-full max-w-[550px]">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription className="text-[16px]">
          Deploy your new project in one-click.
        </CardDescription>

        <CardContent>
          <form className="flex flex-col gap-6" action={create}>
            <div className="flex flex-col gap-2">
              <Label className="text-white lg:text-lg">Name | URL</Label>
              <Input
                className="flex-1 bg-dark-main text-white text-[20px] font-medium"
                defaultValue={path!}
                onChange={e => handleUpdate(e.target.value)}
                placeholder="Product name..."
                name="name"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-white lg:text-lg">Fields</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="name"
                  className="checked:bg-red-500 data-[state=checked]:bg-green-500"
                  onClick={handleUpdateFields}
                  defaultChecked
                />
                <Label htmlFor="name" className="text-white text-lg">
                  Name
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="email-address"
                  className="checked:bg-red-500 data-[state=checked]:bg-green-500"
                  onClick={handleUpdateFields}
                  defaultChecked
                />
                <Label htmlFor="email-address" className="text-white text-lg">
                  Email address
                </Label>
              </div>
            </div>

            <Create text="Create" />
          </form>
        </CardContent>
      </CardHeader>
    </Card>
  )
}

