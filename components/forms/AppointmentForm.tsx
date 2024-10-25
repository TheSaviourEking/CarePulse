"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Form } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { getAppointmentSchema } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { FormFieldType } from "./PatientForm"
import { DOCTORS } from "@/constants"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { createAppointment } from "@/lib/actions/appoinment.actions"

const AppointmentForm = ({ type, userId, patientId }: { userId: string, patientId: string, type: 'create' | "cancel" | 'schedule' }) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const AppointmentFormValidation = getAppointmentSchema(type);

    const form = useForm<z.infer<typeof AppointmentFormValidation>>({
        resolver: zodResolver(AppointmentFormValidation),
        defaultValues: {
            primaryPhysician: "",
            schedule: new Date(),
            reason: '',
            note: '',
            cancellationReason: ''
        },
    })

    const onSubmit = async (values: z.infer<typeof AppointmentFormValidation>) => {
        setIsLoading(true);

        let status = null;

        switch (type) {
            case 'schedule':
                status = 'scheduled';
                break;
            case 'cancel':
                status = 'cancelled';
                break;
            // case 'create':
            //     status = 'created';
            //     break;
            default:
                status = 'pending';
                break;
        }
        try {
            if (type === 'create') {
                const appointmentData = {
                    userId,
                    patient: patientId,
                    primaryPhysician: values.primaryPhysician,
                    schedule: new Date(values.schedule),
                    reason: values.reason!,
                    note: values.note,
                    status: status as Status,
                }

                const appointment = await createAppointment(appointmentData);
                if (appointment) {
                    form.reset();
                    router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`)
                }
            }
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    let buttonLabel = null;

    switch (type) {
        case 'cancel':
            buttonLabel = 'Cancel Appointment';
            break;
        case 'create':
            buttonLabel = 'Create Appointment';
            break;
        case 'schedule':
            buttonLabel = 'Schedule Appointment';
            break;
        default:
            break;
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">

                <section className="mb-12 space-y-4">
                    <h1 className="header">New Appointment</h1>
                    <p className="text-dark-700">Request A New Appointment in 10 seconds</p>
                </section>

                {type !== 'cancel' && (
                    <>
                        <CustomFormField control={form.control} fieldType={FormFieldType.SELECT} name='primaryPhysician' label='Doctor' placeholder='Select a Doctor'>
                            {DOCTORS.map((doctor, index) => (
                                <SelectItem key={index} value={doctor.name}>
                                    <div className="cursor-pointer flex items-center gap-2">
                                        <Image src={doctor.image} width={32} height={32} alt={`doctor ${doctor.name}`} className="rounded-full border border-dark-500" />
                                        <p>{doctor.name}</p>
                                    </div>
                                </SelectItem>
                            ))}
                        </CustomFormField>

                        <CustomFormField fieldType={FormFieldType.DATE_PICKER} control={form.control} name='schedule' label="Expected Appointment Date" showTimeSelect dateFormat="MM/dd/yyyy - h:mm aa" />

                        <div className="flex flex-col gap-6 xl:flex-row">
                            <CustomFormField fieldType={FormFieldType.TEXTAREA} control={form.control} name="reason" label="Reason for appointment" placeholder="Enter reason for appointment" />
                            <CustomFormField fieldType={FormFieldType.TEXTAREA} control={form.control} name="note" label="Notes" placeholder="Enter notes" />
                        </div>
                    </>
                )}

                {
                    type === 'cancel' && (
                        <CustomFormField fieldType={FormFieldType.TEXTAREA} control={form.control} name="cancellationReason" label="Reason for cancellation" placeholder="Enter reason for cancellation" />
                    )
                }

                <SubmitButton isLoading={isLoading} className={cn(type === 'cancel' ? 'shad-danger-btn' : 'shad-primary-btn', 'w-full')}>{buttonLabel}</SubmitButton>
            </form>
        </Form>
    )
}

export default AppointmentForm