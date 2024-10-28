'use server'

import { ID, Query } from "node-appwrite";
import { APPOINTMENT_COLLECTION_ID, DATABASE_ID, databases, messaging } from "../appwrite.config";
import { formatDateTime, parseStringify } from "../utils";
import { Appointment } from "@/types/appwrite.types";
import { revalidatePath } from "next/cache";
import { getUser } from "./patient.actions";

export const createAppointment = async (appointmentData: CreateAppointmentParams) => {
    try {
        const newAppointment = await databases.createDocument(DATABASE_ID!, APPOINTMENT_COLLECTION_ID!, ID.unique(), appointmentData);
        return parseStringify(newAppointment)
    } catch (error) {
        console.error(error)
    }
};

export const getAppointment = async (appointmentId: string) => {
    try {
        const appointment = await databases.getDocument(DATABASE_ID!, APPOINTMENT_COLLECTION_ID!, appointmentId);
        return parseStringify(appointment);
    } catch (error) {
        console.error(error)
    }
}

export const getRecentAppointmentList = async () => {
    try {
        const appointments = await databases.listDocuments(DATABASE_ID!, APPOINTMENT_COLLECTION_ID!, [
            Query.orderDesc('$createdAt')
        ]);

        const initialCounts = {
            scheduledCounts: 0,
            pendingCounts: 0,
            cancelledCounts: 0
        }

        const counts = (appointments.documents as Appointment[]).reduce((acc, appointment) => {
            if (appointment.status === 'scheduled') acc.scheduledCounts += 1;
            else if (appointment.status === 'cancelled') acc.cancelledCounts += 1;
            else if (appointment.status === 'pending') acc.pendingCounts += 1;

            return acc;
        }, initialCounts);

        const data = {
            totalCount: appointments.total,
            ...counts,
            document: appointments.documents
        };

        return parseStringify(data)
    } catch (error) { console.error(error) }
}

export const updateAppointment = async ({ appointmentId, userId, appointment, type }: UpdateAppointmentParams) => {
    try {
        const updatedAppointment = await databases.updateDocument(
            DATABASE_ID!, APPOINTMENT_COLLECTION_ID!, appointmentId, appointment
        )

        if (!updatedAppointment) {
            throw new Error('Appointment not found')
        }

        // GET user
        const patient = await getUser(userId);

        // SMS notification
        const smsMessage = `
        Hi, ${patient.name} it's CarePulse.
        ${type === 'schedule'
                ? `Your appointment has been scheduled for ${formatDateTime(appointment.schedule!).dateTime} with Dr. ${appointment.primaryPhysician}.`
                : `We regret to inform you that your appointment has been cancelled for the following reason: ${appointment.cancellationReason}`
            };
            `

        await sendSMSNotification(userId, smsMessage);
        revalidatePath('/admin');

        return updatedAppointment
    } catch (error) { console.error(error) }
}

export const sendSMSNotification = async (userId: string, content: string) => {
    try {
        const message = await messaging.createSms(
            ID.unique(),
            content,
            [],
            [userId]
        )

        return parseStringify(message);
    } catch (error) {
        console.error(error)
    }
}
