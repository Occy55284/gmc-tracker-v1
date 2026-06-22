export const ROOM_PRICE = 3.40

export function countRooms(roomList: string): number {
  return roomList
    .split('\n')
    .map((room) => room.trim())
    .filter(Boolean).length
}

export function refreshmentTotal(roomList: string): number {
  return Number((countRooms(roomList) * ROOM_PRICE).toFixed(2))
}

export function money(value: number | string | null | undefined): string {
  const num = Number(value || 0)
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP'
  }).format(num)
}
