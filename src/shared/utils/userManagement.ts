import { supabase } from '../../lib/supabase'
import type { AppUser, UserRole } from '../store/authStore'

export const createUserInDatabase = async (
  authUserId: string, 
  email: string, 
  name: string, 
  role: UserRole = 'worker'
): Promise<AppUser | null> => {
  try {
    const { data: userData, error } = await supabase
      .from('users')
      .insert({
        id: authUserId,
        email,
        name,
        role,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Failed to create user in database:', error)
      return null
    }

    return userData
  } catch (error) {
    console.error('Error creating user in database:', error)
    return null
  }
}

export const getUserFromDatabase = async (authUserId: string): Promise<AppUser | null> => {
  try {
    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUserId)
      .single()

    if (error) {
      console.error('Failed to get user from database:', error)
      return null
    }

    return userData
  } catch (error) {
    console.error('Error getting user from database:', error)
    return null
  }
}
