import React from 'react'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Control } from 'react-hook-form'
import { FormFieldType } from './forms/PatientForm'
import Image from 'next/image'

import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'



interface CustomProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: Control<any>,
    fieldType: FormFieldType,
    name: string,
    label?: string,
    placeholder?: string,
    iconSrc?: string,
    iconAlt?: string,
    disabled?: boolean,
    dateFormat?: string,
    showTimeSelect?: string,
    children?: React.ReactNode,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderSkeleton?: (field: any) => React.ReactNode
}

const RenderField = ({ field, props }: { field: any, props: CustomProps }) => {
    const { fieldType, iconSrc, iconAlt, placeholder } = props;

    switch (fieldType) {
        case FormFieldType.INPUT:
            return (
                <div className='flex gap-4 rounded-md border border-dark-500 bg-dark-400 [&:has(:focus)]:ring-2 [&:has(:focus)]:ring-primary-500 transition-all duration-300'>
                    {iconSrc && (
                        <Image src={iconSrc} alt={iconAlt || 'icon'} width={24} height={24} className='ml-2' />
                    )}

                    <FormControl>
                        <Input type={fieldType || 'text'} placeholder={placeholder} {...field} className='shad-input border-0 w-full focus:outline-none' />
                    </FormControl>
                </div>
            )
        case FormFieldType.PHONE_INPUT:
            return (
                <FormControl>
                    <PhoneInput defaultCountry='US' placehoder={placeholder} international withCountryCallingCode value={field.value as EI64Number || undefined} onChange={field.onChange} className='input-phone'/>
                </FormControl>
            )
        default:
            break;
    }
}

const CustomFormField = (props: CustomProps) => {
    const { control, fieldType, name, label } = props;

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className='flex-1'>
                    {fieldType !== FormFieldType.CHECKBOX && label && (
                        <FormLabel>{label}</FormLabel>
                    )}
                    <RenderField field={field} props={props} />
                </FormItem>

            )}
        />
    )
}

export default CustomFormField
