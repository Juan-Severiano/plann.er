import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Loading } from "@/components/loading";
import { TripDetails, tripServer } from "@/server/trip-server";
import { colors } from "@/styles/colors";
import dayjs from "dayjs";
import { router, useLocalSearchParams } from "expo-router";
import { CalendarRange, Info, MapPin, Settings2, Calendar as IconCalendar, User, Mail, CircleUser } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, Keyboard, Text, TouchableOpacity, View } from "react-native";
import { Activities } from "./activities";
import { Details } from "./details";
import { Modal } from "@/components/modal";
import { Calendar } from "@/components/calendar";
import { DateData } from "react-native-calendars";
import { calendarUtils, DatesSelected } from "@/utils/calendarUtils";
import { validateInput } from "@/utils/validateInput";
import { participantsServer } from "@/server/participants-server";
import { tripStorage } from "@/storage/trip";

export type TripData = TripDetails & {
  when: string
}

enum MODAL {
  NONE = 0,
  UPDATE_TRIP = 1,
  CALENDAR = 2,
  CONFIRM = 3
}

export default function Trip() {
  const [isLoadingTrip, setIsLoadingTrip] = useState(true)
  const [isUpdatingTrip, setIsUpdatingTrip] = useState(false)
  const [isConfirmingAttendance, setIsConfirmingAttendance] = useState(false)
  const { id: tripId, participant } = useLocalSearchParams<{ id: string, participant?: string }>();
  const [tripDetails, setTripDetails] = useState({} as TripData)
  const [option, setOption] = useState<'activity' | 'details'>('activity')
  const [showModal, setShowModal] = useState(MODAL.NONE)
  const [selectedDates, setSelectedDates] = useState({} as DatesSelected)
  const [destination, setDestination] = useState('')

  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')

  async function getTripDetails() {
    try {
      setIsLoadingTrip(true);

      if (!tripId) {
        return router.back();
      }

      const trip = await tripServer.getById(tripId);

      const maxLenghtDestination = 14
      const destination = trip.destination.length > maxLenghtDestination ?
        trip.destination.slice(0, maxLenghtDestination) + '...' : trip.destination
      const starts_at = dayjs(trip.starts_at).format("DD");
      const ends_at = dayjs(trip.ends_at).format("DD");
      const month = dayjs(trip.ends_at).format("MMM");
      setDestination(tripDetails.destination)
      setTripDetails({
        ...trip,
        when: `${destination} de ${starts_at} a ${ends_at} de ${month}.`
      });
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoadingTrip(false)
    }
  }

  function handleSelectDate(selectedDay: DateData) {
    const dates = calendarUtils.orderStartsAtAndEndsAt({
      startsAt: selectedDates.startsAt,
      endsAt: selectedDates.endsAt,
      selectedDay,
    })

    setSelectedDates(dates)
  }

  async function handleUpdateTrip() {
    try {
      setIsUpdatingTrip(true)
      if (!tripId) {
        return
      }

      if (!destination || !selectedDates.startsAt || !selectedDates.endsAt) {
        return Alert.alert('Atualizar viagem', 'Lembre-se de, aalém de preencher o destino, selecione data de início e fim da viagem')
      }


      await tripServer.update({
        id: tripId,
        destination,
        starts_at: dayjs(selectedDates.startsAt.dateString).toString(),
        ends_at: dayjs(selectedDates.endsAt.dateString).toString(),
      })

      Alert.alert('Atualizar viagem', 'Viagem atualizada com sucesso', [
        {
          text: 'OK',
          onPress: () => {
            getTripDetails()
            setShowModal(MODAL.NONE)
          }
        }
      ])
    } catch (error) {
      console.log(error)
    } finally {
      setIsUpdatingTrip(false)
    }
  }

  async function handleConfirmAttendance() {
    try {
      setIsConfirmingAttendance(true)

      if (!participant || !tripId) {
        return
      }

      if (!guestName.trim() || !guestEmail.trim()) {
        return Alert.alert('Confirmação', 'Preencha o nome e e-mail para confirmar a viagem')
      }

      if (!validateInput.email(guestEmail.trim())) return Alert.alert('Confirmação', 'E-mail inválido')

      await participantsServer.confirmTripByParticipantId({
        email: guestEmail.trim(),
        name: guestName.trim(),
        participantId: participant,
      })

      Alert.alert('Confirmação', 'Viagem confirmada com sucesso!')

      await tripStorage.save(tripId!)

      setShowModal(MODAL.NONE)
    } catch (error) {
      console.log(error)
      Alert.alert('Confirmar', 'Não foi possivel confirmar')
    } finally {
      setIsConfirmingAttendance(false)
    }
  }

  useEffect(() => {
    getTripDetails()
  }, [])

  if (isLoadingTrip) {
    <Loading />
  }

  return (
    <View className="flex-1 px-5 pt-16 bg-zinc-950">
      <Input variant="tertiary">
        <MapPin color={colors.zinc[400]} size={20} />
        <Input.Field value={tripDetails.when} readOnly />
        <TouchableOpacity
          activeOpacity={0.6}
          className="w-9 h-9 bg-zinc-800 items-center justify-center rounded"
          onPress={() => setShowModal(MODAL.UPDATE_TRIP)}
        >
          <Settings2 color={colors.zinc[400]} size={20} />
        </TouchableOpacity>
      </Input>
      {
        option === 'activity' ? (
          tripDetails && <Activities tripDetails={tripDetails} />
        ) : (
          <Details tripId={tripDetails.id} />
        )
      }
      <View className="w-full absolute -bottom-1 self-center justify-end pb-5 z-10 bg-zinc-950">
        <View className="w-full flex-row bg-zinc-900 p-4 rounded-lg border border-zinc-800 gap-2">
          <Button
            className="flex-1"
            onPress={() => setOption('activity')}
            variant={option === 'activity' ? 'primary' : 'secondary'}
          >
            <CalendarRange color={option === 'activity' ? colors.lime[950] : colors.zinc[200]} />
            <Button.Title>Atividades</Button.Title>
          </Button>
          <Button
            className="flex-1"
            onPress={() => setOption('details')}
            variant={option === 'details' ? 'primary' : 'secondary'}
          >
            <Info color={option === 'details' ? colors.lime[950] : colors.zinc[200]} />
            <Button.Title>Detalhes</Button.Title>
          </Button>
        </View>
      </View>

      <Modal
        title="Atualizar Viagem"
        subtitle="Somente quem criou a viagem pode altera-la"
        visible={showModal === MODAL.UPDATE_TRIP}
        onClose={() => setShowModal(MODAL.NONE)}
      >
        <View className="gap-2 my-4">
          <Input variant="secondary">
            <MapPin color={colors.zinc[400]} size={20} />
            <Input.Field
              placeholder="Para onde?"
              onChangeText={setDestination}
              value={destination}
            />
          </Input>

          <Input variant="secondary">
            <IconCalendar color={colors.zinc[400]} size={20} />
            <Input.Field
              placeholder="Quando?"
              onChangeText={setDestination}
              value={selectedDates.formatDatesInText}
              onPressIn={() => setShowModal(MODAL.CALENDAR)}
              onFocus={() => Keyboard.dismiss()}
            />
          </Input>

          <Button onPress={handleUpdateTrip} isLoading={isUpdatingTrip}>
            <Button.Title>Atualizar</Button.Title>
          </Button>
          <Button onPress={() => router.navigate('(tabs)/account')} isLoading={isUpdatingTrip}>
            <CircleUser color={colors.zinc[800]} />
            <Button.Title>Ir para meu perfil</Button.Title>
          </Button>
        </View>
      </Modal>
      <Modal
        title='Selecionar datas'
        subtitle='Selecione a data de ida e volta da Viagem'
        visible={showModal === MODAL.CALENDAR}
        onClose={() => setShowModal(MODAL.NONE)}
      >
        <View className="gap-4 mt-4">
          <Calendar
            onDayPress={handleSelectDate}
            markedDates={selectedDates.dates}
            minDate={dayjs().toISOString()}
          />
          <Button onPress={() => setShowModal(MODAL.UPDATE_TRIP)}>
            <Button.Title>Confirmar</Button.Title>
          </Button>
        </View>
      </Modal>

      <Modal
        title="Confirmar presença"
        visible={showModal == MODAL.CONFIRM}
      >
        <View className="gap-4 mt-4">
          <Text className="text-zinc-400 font-regular leading-6 my-2">
            Você foi convidado(a) para participar de uma viagem para
            <Text className="font-semibold text-zinc-100">
              {" "}{tripDetails.destination}{" "}
            </Text>
            nas datas de
            <Text className="font-semibold text-zinc-100">
              {" "}{dayjs(tripDetails.starts_at).date()} a {" "}
              {dayjs(tripDetails.ends_at).date()} de {" "}
              {dayjs(tripDetails.ends_at).format('MMMM')}. {"\n\n"}

            </Text>
            Para confirmar sua presença na viagem preencha os dados abaixo:
          </Text>

          <Input variant="secondary">
            <User color={colors.zinc[400]} size={20} />
            <Input.Field
              placeholder="Seu nome completo"
              value={guestName}
              onChangeText={setGuestName}
            />
          </Input>
          <Input variant="secondary">
            <Mail color={colors.zinc[400]} size={20} />
            <Input.Field
              placeholder="E-mail de confirmação"
              value={guestEmail}
              onChangeText={setGuestEmail}
            />
          </Input>

          <Button isLoading={isConfirmingAttendance} onPress={handleConfirmAttendance}>
            <Button.Title>Confirmar minha presença</Button.Title>
          </Button>
        </View>
      </Modal>
    </View>
  )
}
