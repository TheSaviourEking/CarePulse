"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Form } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { UserFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patient.actions"



export enum FormFieldType {
  INPUT = 'input',
  TEXTAREA = 'textarea',
  CHECKBOX = 'checkbox',
  PHONE_INPUT = 'phoneInput',
  DATE_PICKER = 'datePicker',
  SELECT = 'select',
  SKELETON = 'skeleton'
}

const PatientForm = () => {
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">

        <section className="mb-12 space-y-4">
          <h1 className="header">Hi there! 👋</h1>
          <p className="text-dark-700">Schedule your first appointment</p>
        </section>

        <CustomFormField control={form.control} fieldType={FormFieldType.INPUT} name='name' label='Full Name' placeholder='John Doe' iconSrc="/assets/icons/user.svg" iconAlt="User" />
        <CustomFormField control={form.control} fieldType={FormFieldType.INPUT} name='email' label='Email' placeholder='example@mail.com' iconSrc="/assets/icons/email.svg" iconAlt="Email" />
        <CustomFormField control={form.control} fieldType={FormFieldType.PHONE_INPUT} name='phone' label='Phone Number' placeholder='(555) 454-3454' />

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  )
}

export default PatientForm
