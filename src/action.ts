'use server'

import { IVerifyUser, WaitList } from '@app/types'
import supabase from '@lib/supabase'
import { PostgrestError } from '@supabase/supabase-js'
import { getServerSession } from 'next-auth'

// TODO: Extend the parameters
type Error = Parameters<(error: PostgrestError, msg?: string) => void>
export async function logError(...args: Error) {
  console.error(args[1] ?? 'An error occured', args[0])
}

export async function findId(email: string) {
  const { data, error } = await supabase
    .from('account')
    .select('id')
    .eq('email', email)

  if (error) {
    await logError(error, 'User not found')
  }

  return data ? data[0]?.id : null
}

export async function verifyUser(
  email: string,
  password: string
): Promise<IVerifyUser> {
  const { data: user, error } = await supabase
    .from('account')
    .select('*')
    .eq('email', email)

  if (error) {
    console.error('Error fetching user:', error)
  }

  return !user
    ? { status: false, message: 'user not found', user: null }
    : user[0].password === password
      ? { message: '', status: true, user: user[0] }
      : { status: false, message: 'password is incorrect', user: null }
}

export async function createTable(name: string) {
  const { data, error } = await supabase.rpc('create_table', {
    name
  })

  if (error) await logError(error, 'Error creating table!')

  return { data, error }
}

export async function createWaitlist(email: string, name: string) {
  const user_id = await findId(email!)
  const table_name = `${email}_${name}`

  // creates a new table.
  const { error: table_creation_error } = await createTable(table_name)!

  if (table_creation_error) return

  // creates a new waitlist in the general database
  const { error } = await supabase
    .from('waitlists')
    .insert({ name, user_id: user_id, table_name })

  if (error) await logError(error)

  return { table_creation_error, error }
}

export async function findTable(name: string) {
  const { data, error } = await supabase.from(name).select('*')

  if (error) await logError(error)

  return data
}

export async function getWaitlist(name: string) {
  const { data, error } = await supabase
    .from('waitlists')
    .select('*')
    .eq('name', name)

  if (error) await logError(error)

  const waitlist_table_info: WaitList = data ? data[0] : null

  const results: any = await findTable(waitlist_table_info?.table_name)

  return { waitlist_table_info, results } // the individual waitlist that was created by supabase function
}

export async function insertIntoTable(
  email: string,
  table_name: string,
  username?: string
) {
  const { waitlist_table_info } = await getWaitlist(table_name)

  const { error } = await supabase
    .from(waitlist_table_info?.table_name)
    .insert({ email, username })

  if (error) await logError(error)
}

