export function generateFileName(userId: string, originalName: string): string {
  const timestamp = Date.now()
  const extension = originalName.split('.').pop()?.toLowerCase() || 'jpg'
  const randomString = Math.random().toString(36).substring(2, 8)
  
  return `${userId}/${timestamp}-${randomString}.${extension}`
}
