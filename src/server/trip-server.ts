import { api } from "./api"

export type TripDetails = {
  id: string
  destination: string
  starts_at: string
  ends_at: string
  is_confirmed: boolean
}

type TripCreate = Omit<TripDetails, 'id' | 'is_confirmed'> & {
  emails_to_invite: string[]
  owner_name: string
  owner_email: string
}

async function getById(id: string) {
  try {
    const { data } = await api.get<{ trip: TripDetails }>(`/trips/${id}`)
    return data.trip
  } catch (err) {
    throw err
  }
}

async function create({ destination, ends_at, starts_at, emails_to_invite, owner_email, owner_name }: TripCreate) {
  try {
    const { data } = await api.post<{ tripId: string }>('/trips', {
      destination,
      ends_at,
      starts_at,
      emails_to_invite,
      owner_name,
      owner_email
    });

    return data
  } catch (error) {
    throw error
  }
}

async function update({ destination, ends_at, id, starts_at }: Omit<TripDetails, 'is_confirmed'>) {
  try {
    await api.put(`/trips/${id}`, {
      destination, ends_at, starts_at
    })
  } catch (error) {
    throw error
  }
}

export const tripServer = {
  getById, create, update
}
