import AsyncStorage from '@react-native-async-storage/async-storage'

const TRIP_STORAGE_KEY = '@planner:tripId'

async function save(tripId: string) {
  try {
    await AsyncStorage.setItem(TRIP_STORAGE_KEY, tripId)    
  } catch (error) {
    throw error
  }
}

async function get() {
  try {
    return await AsyncStorage.getItem(TRIP_STORAGE_KEY)
  } catch (error) {
    throw error
  }
}

async function remove() {
  try {
    await AsyncStorage.removeItem(TRIP_STORAGE_KEY)
  } catch (error) {
    throw error
  }
}

export const tripStorage = {
  save, get, remove
}