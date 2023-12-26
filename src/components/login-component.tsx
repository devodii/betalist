'use client'

import * as React from 'react'
import * as Auth from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Input } from '@ui/input'

interface Props {
  path?: string
}

export const LoginComponent = ({ path }: Props) => {
  const { data: session } = Auth.useSession()
  const { refresh } = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formdata = new FormData(e.currentTarget)
    const email = formdata.get('email')
    const password = formdata.get('password')

    const response = await Auth.signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl: path ? `/app.betalist.com/create?url=${path}` : '/app.betalist.com'
    })

    refresh()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto flex min-h-screen justify-center items-center w-screen flex-col gap-4"
    >
      <Input
        placeholder="johndoe@gmail.com"
        className="text-black"
        name="email"
      />
      <Input placeholder="password" className="text-black" name="password" />
      <button className="border px-4 py-2 rounded-md">Login</button>
    </form>
  )
}

