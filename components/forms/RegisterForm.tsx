"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Form, FormControl } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { UserFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patient.actions"
import { FormFieldType } from "./PatientForm"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { GENDEROPTIONS } from "@/constants"
import { Label } from "../ui/label"


const RegisterForm = ({ user }: { user: User }) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof UserFormValidation>>({
        resolver: zodResolver(UserFormValidation),
        defaultValues: {
            name: "",
            email: '',
            phone: ''
        },
    })

    const onSubmit = async ({ name, email, phone }: z.infer<typeof UserFormValidation>) => {
        setIsLoading(true)

        try {
            const userData = { name, email, phone }
            const newUser = await createUser(userData)
            if (newUser) router.push(`/patients/${newUser.$id}/register`)
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">

                <section className="mb-12 space-y-4">
                    <h1 className="header">Welcome 👋</h1>
                    <p className="text-dark-700">Let us know more about yourself</p>
                </section>

                <section className="space-y-6">
                    <h2 className="sub-header">Personal Information</h2>
                </section>

                <CustomFormField control={form.control} fieldType={FormFieldType.INPUT} name='name' label="Full Name" placeholder='John Doe' iconSrc="/assets/icons/user.svg" iconAlt="User" />

                <div className="flex flex-col xl:flex-row gap-6">
                    <CustomFormField control={form.control} fieldType={FormFieldType.INPUT} name='email' label='Email' placeholder='example@mail.com' iconSrc="/assets/icons/email.svg" iconAlt="Email" />
                    <CustomFormField control={form.control} fieldType={FormFieldType.PHONE_INPUT} name='phone' label='Phone Number' placeholder='(555) 454-3454' />
                </div>

                <div className="flex flex-col xl:flex-row gap-6">
                    <CustomFormField control={form.control} fieldType={FormFieldType.DATE_PICKER} name='birthdate' label='Date Of Birth' placeholder='example@mail.com' iconSrc="/assets/icons/calendar.svg" iconAlt="Calendar" />
                    <CustomFormField control={form.control} fieldType={FormFieldType.SKELETON} name='gender' label='Gender' placeholder='(555) 454-3454' renderSkeleton={(field => (
                        <FormControl>
                            <RadioGroup className="flex h-11 gap-6 xl:justify-between" onValueChange={field.onChange} defaultValue={field.value}>
                                {GENDEROPTIONS.map((option, index) => (
                                    <div key={index} className="radio-group">
                                        <RadioGroupItem value={option} id={option}>
                                            <Label htmlFor={option} className="cursor-pointer">{option}</Label>
                                        </RadioGroupItem>
                                    </div>
                                ))}
                            </RadioGroup>
                        </FormControl>
                    ))} />
                </div>

                <div className="flex flex-col xl:flex-row gap-6">
                    <CustomFormField control={form.control} fieldType={FormFieldType.INPUT} name='email' label='Email' placeholder='example@mail.com' iconSrc="/assets/icons/email.svg" iconAlt="Email" />
                    <CustomFormField control={form.control} fieldType={FormFieldType.PHONE_INPUT} name='phone' label='Phone Number' placeholder='(555) 454-3454' />
                </div>

                <div className="flex flex-col xl:flex-row gap-6">
                    <CustomFormField control={form.control} fieldType={FormFieldType.INPUT} name='email' label='Email' placeholder='example@mail.com' iconSrc="/assets/icons/email.svg" iconAlt="Email" />
                    <CustomFormField control={form.control} fieldType={FormFieldType.PHONE_INPUT} name='phone' label='Phone Number' placeholder='(555) 454-3454' />
                </div>

                <div className="flex flex-col xl:flex-row gap-6">
                    <CustomFormField control={form.control} fieldType={FormFieldType.INPUT} name='email' label='Email' placeholder='example@mail.com' iconSrc="/assets/icons/email.svg" iconAlt="Email" />
                    <CustomFormField control={form.control} fieldType={FormFieldType.PHONE_INPUT} name='phone' label='Phone Number' placeholder='(555) 454-3454' />
                </div>

                <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
            </form>
        </Form>
    )
}

export default RegisterForm
