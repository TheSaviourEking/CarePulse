"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, SubmitHandler } from "react-hook-form"
import { z } from "zod"

import { Form, FormControl } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { PatientFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { registerPatient } from "@/lib/actions/patient.actions"
import { FormFieldType } from "./PatientForm"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { DOCTORS, GENDEROPTIONS, IDENTIFICATIONTYPES, PATIENTDEFAULTVALUES } from "@/constants"
import { Label } from "../ui/label"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import FileUploader from "../FileUploader"


const RegisterForm = ({ user }: { user: User }) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof PatientFormValidation>>({
        resolver: zodResolver(PatientFormValidation),
        defaultValues: {
            ...PATIENTDEFAULTVALUES,
            name: user.name,
            email: user.email,
            phone: user.phone,
        },
    });

    const onSubmit: SubmitHandler<z.infer<typeof PatientFormValidation>> = async (values: z.infer<typeof PatientFormValidation>) => {

        setIsLoading(true)


        let formData;

        if (
            values?.identificationDocument &&
            values.identificationDocument?.length > 0
        ) {
            const blobFile = new Blob([values.identificationDocument[0]], {
                type: values.identificationDocument[0].type,
            });

            formData = new FormData();
            formData.append('blobfile', blobFile);
            formData.append('fileName', values.identificationDocument[0].name);
        }

        try {
            const patientData = {
                userId: user.$id,
                name: values.name,
                email: values.email,
                phone: values.phone,
                birthDate: new Date(values.birthDate),
                gender: values.gender.toLowerCase() as Gender,
                address: values.address,
                occupation: values.occupation,
                emergencyContactName: values.emergencyContactName,
                emergencyContactNumber: values.emergencyContactNumber,
                primaryPhysician: values.primaryPhysician,
                insuranceProvider: values.insuranceProvider,
                insurancePolicyNumber: values.insurancePolicyNumber,
                allergies: values.allergies,
                currentMedication: values.currentMedication,
                familyMedicalHistory: values.familyMedicalHistory,
                pastMedicalHistory: values.pastMedicalHistory,
                identificationType: values.identificationType,
                identificationNumber: values.identificationNumber,
                identificationDocument: values.identificationDocument ? formData : undefined,
                privacyConsent: values.privacyConsent,
                treatmentConsent: values.treatmentConsent,
                disclosureConsent: values.disclosureConsent
            };

            const patient = await registerPatient(patientData);
            if (patient) router.push(`/patients/${user.$id}/new-appointment`);
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    const { handleSubmit, control } = form;
    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-12 flex-1">

                <section className="mb-12 space-y-4">
                    <h1 className="header">Welcome 👋</h1>
                    <p className="text-dark-700">Let us know more about yourself</p>
                </section>

                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Personal Information</h2>
                    </div>
                </section>

                <CustomFormField control={control} fieldType={FormFieldType.INPUT} name='name' label="Full Name" placeholder='John Doe' iconSrc="/assets/icons/user.svg" iconAlt="User" />

                <div className="flex flex-col xl:flex-row gap-6">
                    <CustomFormField control={control} fieldType={FormFieldType.INPUT} name='email' label='Email' placeholder='example@mail.com' iconSrc="/assets/icons/email.svg" iconAlt="Email" />

                    <CustomFormField control={control} fieldType={FormFieldType.PHONE_INPUT} name='phone' label='Phone Number' placeholder='(555) 454-3454' />
                </div>

                <div className="flex flex-col xl:flex-row gap-6">
                    <CustomFormField control={control} fieldType={FormFieldType.DATE_PICKER} name='birthdate' label='Date Of Birth' placeholder='example@mail.com' iconSrc="/assets/icons/calendar.svg" iconAlt="Calendar" />
                    <CustomFormField control={control} fieldType={FormFieldType.SKELETON} name='gender' label='Gender' renderSkeleton={(field => (
                        <FormControl>
                            <RadioGroup className="flex h-11 gap-6 xl:justify-between" onValueChange={field.onChange} defaultValue={field.value}>
                                {GENDEROPTIONS.map((option, index) => (
                                    <div key={index} className="radio-group">
                                        <RadioGroupItem value={option} id={option} />
                                        <Label htmlFor={option} className="cursor-pointer">{option}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </FormControl>
                    ))} />
                </div>

                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField fieldType={FormFieldType.INPUT} control={form.control} name="address" label="Address" placeholder="14 street, New york, NY - 5101" />
                    <CustomFormField fieldType={FormFieldType.INPUT} control={form.control} name="occupation" label="Occupation" placeholder=" Software Engineer" />
                </div>

                <div className="flex flex-col xl:flex-row gap-6">
                    <CustomFormField control={control} fieldType={FormFieldType.INPUT} name='emergencyContactName' label='Emergency Contact Name' placeholder='Amy Winehouse' />
                    <CustomFormField control={control} fieldType={FormFieldType.PHONE_INPUT} name='emergencyContactNumber' label='Emergency Contact Number' placeholder='(555) 456-7890' />
                </div>

                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Medical Information</h2>
                    </div>
                </section>

                <CustomFormField control={control} fieldType={FormFieldType.SELECT} name='primaryPhysician' label='Primary Care Physician' placeholder='Select a Physician'>
                    {DOCTORS.map((doctor, index) => (
                        <SelectItem key={index} value={doctor.name}>
                            <div className="cursor-pointer flex items-center gap-2">
                                <Image src={doctor.image} width={32} height={32} alt={`doctor ${doctor.name}`} className="rounded-full border border-dark-500" />
                                <p>{doctor.name}</p>
                            </div>
                        </SelectItem>
                    ))}
                </CustomFormField>

                <div className="flex flex-col xl:flex-row gap-6">
                    <CustomFormField control={control} fieldType={FormFieldType.INPUT} name='insuranceProvider' label='Insurance Provider' placeholder='BlueCrocs BlueShield' />
                    <CustomFormField control={control} fieldType={FormFieldType.INPUT} name='insurancePolicyNumber' label='Insurance Policy Number' placeholder='ABC123456789' />
                </div>

                <div className="flex flex-col xl:flex-row gap-6">
                    <CustomFormField control={control} fieldType={FormFieldType.TEXTAREA} name='allergies' label='Allergies (if any)' placeholder='Peanuts, Penicillin, Pollen' />
                    <CustomFormField control={control} fieldType={FormFieldType.TEXTAREA} name='currentMedication' label='Current Medication (if any)' placeholder='Ibuprofen 200mg, Paracetamol 500mg' />
                </div>

                <div className="flex flex-col xl:flex-row gap-6">
                    <CustomFormField control={control} fieldType={FormFieldType.TEXTAREA} name='familyMedicalHistory' label='Family Medical History (if any)' placeholder='Mother Had Brain Cancer, Father had a heart attack' />
                    <CustomFormField control={control} fieldType={FormFieldType.TEXTAREA} name='pastMedicalHistory' label='Past Medical History (if any)' placeholder='Appendectomy Tonsillectomy' />
                </div>


                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Identification and Verification</h2>
                    </div>
                </section>

                <CustomFormField control={control} fieldType={FormFieldType.SELECT} name='identificationType' label='Identification Type' placeholder='Select Identification Type'>
                    {IDENTIFICATIONTYPES.map((identificationType, index) => (
                        <SelectItem key={index} value={identificationType}>
                            {identificationType}
                        </SelectItem>
                    ))}
                </CustomFormField>

                <CustomFormField control={control} fieldType={FormFieldType.INPUT} name='identificationNumber' label='Identification Number' placeholder='123456789' />

                <CustomFormField control={control} fieldType={FormFieldType.SKELETON} name='identificationDocument' label='Scanned Copy of Identification Document'
                    renderSkeleton={(field => (
                        <FormControl>
                            <FileUploader files={field.value} onChange={field.onChange} />
                        </FormControl>
                    ))} />



                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Consent and Privacy</h2>
                    </div>
                </section>

                <CustomFormField control={control} fieldType={FormFieldType.CHECKBOX} name='treatmentConsent' label='I consent to treatment' placeholder='123456789' />
                <CustomFormField control={control} fieldType={FormFieldType.CHECKBOX} name='disclosureConsent' label='I consent to disclosure of information' placeholder='123456789' />
                <CustomFormField control={control} fieldType={FormFieldType.CHECKBOX} name='privacyConsent' label='I consent to privacy policy' placeholder='123456789' />

                <SubmitButton isLoading={isLoading}>Submit and Continue</SubmitButton>
            </form>
        </Form>
    )
}

export default RegisterForm
