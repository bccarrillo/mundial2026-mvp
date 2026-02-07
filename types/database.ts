export interface Memory {
  id: string
  user_id: string
  title: string
  description: string
  image_url: string
  match_date: string
  team: string
  is_public: boolean
  likes: number
  created_at: string
  updated_at: string
  deleted_at?: string | null
  deleted_by?: string | null
  deletion_reason?: string | null
  profiles?: Profile
}

export interface Profile {
  id: string
  email: string
  display_name: string
  created_at: string
  updated_at: string
}

export interface Invitation {
  id: string
  inviter_id: string
  invitee_email: string | null
  invitee_id: string | null
  status: 'pending' | 'accepted'
  reward_claimed: boolean
  created_at: string
}

export interface User {
  id: string
  email: string
  created_at: string
}

export interface Comment {
  id: string
  user_id: string
  memory_id: string
  content: string
  created_at: string
  profiles?: Profile
}
