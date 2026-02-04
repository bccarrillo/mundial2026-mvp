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
}

export interface User {
  id: string
  email: string
  created_at: string
}
