import React from 'react'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Control, FieldError, FieldErrorsImpl, Merge } from 'react-hook-form'
import { FormFieldType } from './forms/PatientForm'
import Image from 'next/image'

import { E164Number } from 'libphonenumber-js/core'

import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Select, SelectContent, SelectTrigger, SelectValue } from './ui/select'
import { Textarea } from './ui/textarea'
import { Checkbox } from './ui/checkbox'

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
    showTimeSelect?: boolean,
    children?: React.ReactNode,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderSkeleton?: (field: any) => React.ReactNode
}

// const RenderField = ({ field, props }: { field: any, props: CustomProps }) => {
//     const { fieldType, iconSrc, iconAlt, placeholder, showTimeSelect, dateFormat, renderSkeleton } = props;

//     switch (fieldType) {
//         case FormFieldType.INPUT:
//             return (
//                 <div>
//                     <div className='flex gap-4 rounded-md border border-dark-500 bg-dark-400 [&:has(:focus)]:ring-2 [&:has(:focus)]:ring-primary-500 transition-all duration-300'>
//                         {iconSrc && (
//                             <Image src={iconSrc} alt={iconAlt || 'icon'} width={24} height={24} className='ml-2' />
//                         )}

//                         <FormControl>
//                             <Input type={fieldType || 'text'} placeholder={placeholder} {...field} className='shad-input border-0 w-full focus:outline-none' />
//                         </FormControl>
//                     </div>
//                 </div>
//             )

//         case FormFieldType.PHONE_INPUT:
//             return (
//                 <FormControl>
//                     <PhoneInput defaultCountry='US' placehoder={placeholder} international withCountryCallingCode value={field.value as E164Number || undefined} onChange={field.onChange} className='input-phone' />
//                 </FormControl>
//             )

//         case FormFieldType.DATE_PICKER:
//             return (
//                 <div className='flex rounded-md border border-dark-500 bg-dark-400'>
//                     {iconSrc && (
//                         <Image src={iconSrc} alt={iconAlt || 'icon'} width={24} height={24} className='ml-2' />
//                     )}

//                     <FormControl>
//                         <DatePicker selected={field.value} onChange={(date) => field.onChange(date)} dateFormat={dateFormat ?? 'MM/dd/yyyy'} showTimeSelect={showTimeSelect ?? false} timeInputLabel="Time:" wrapperClassName="date-picker" />
//                     </FormControl>
//                 </div>
//             )

//         case FormFieldType.SKELETON:
//             return (
//                 renderSkeleton ? renderSkeleton(field) : null
//             )

//         case FormFieldType.SELECT:
//             return (
//                 <div className='rounded-md border border-dark-500 bg-dark-400 [&:has(:focus)]:ring-2 [&:has(:focus)]:ring-primary-500 transition-all duration-300'>
//                     <FormControl>
//                         <Select onValueChange={field.onChange} defaultValue={field.value}>
//                             <FormControl>
//                                 <SelectTrigger className="shad-select-trigger w-full text-left p-1">
//                                     <SelectValue placeholder={placeholder} />
//                                 </SelectTrigger>
//                             </FormControl>
//                             <SelectContent className="shad-select-content">
//                                 {props.children}
//                             </SelectContent>
//                         </Select>
//                     </FormControl>
//                 </div>
//             );

//         case FormFieldType.TEXTAREA:
//             return (
//                 <FormControl>
//                     <Textarea placeholder={placeholder} {...field} className='shad-textarea' disabled={props.disabled} />
//                 </FormControl>
//             );

//         case FormFieldType.CHECKBOX:
//             return (
//                 <FormControl>
//                     <div className='flex items-center gap-4'>
//                         <Checkbox id={props.name} checked={field.value} onCheckedChange={field.onChange} />
//                         <label htmlFor={props.name} className='checkbox-label'>{props.label}</label>
//                     </div>
//                 </FormControl>
//             )

//         default:
//             break;
//     }
// }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RenderField = ({ field, props, error }: { field: any, props: CustomProps, error?: FieldError | undefined }) => {
    const { fieldType, iconSrc, iconAlt, placeholder, showTimeSelect, dateFormat, renderSkeleton } = props;

    const errorClass = error ? 'border-red-500' : 'border-dark-500';

    switch (fieldType) {
        case FormFieldType.INPUT:
            return (
                <div>
                    <div className={`flex gap-4 rounded-md border ${errorClass} bg-dark-400 [&:has(:focus)]:ring-2 [&:has(:focus)]:ring-primary-500 transition-all duration-300`}>
                        {iconSrc && (
                            <Image src={iconSrc} alt={iconAlt || 'icon'} width={24} height={24} className='ml-2' />
                        )}
                        <FormControl>
                            <Input
                                type="text"
                                placeholder={placeholder}
                                {...field}
                                className='shad-input border-0 w-full focus:outline-none'
                            />
                        </FormControl>
                    </div>
                    {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
                </div>
            );

        case FormFieldType.PHONE_INPUT:
            return (
                <FormControl>
                    <>
                        <PhoneInput
                            defaultCountry='US'
                            placeholder={placeholder}
                            international
                            withCountryCallingCode
                            value={field.value as E164Number || undefined}
                            onChange={field.onChange}
                            className='input-phone'
                        />
                        {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
                    </>
                </FormControl>
            );

        case FormFieldType.DATE_PICKER:
            return (
                <>
                    <div className={`flex rounded-md border ${errorClass} bg-dark-400`}>
                        {iconSrc && (
                            <Image src={iconSrc} alt={iconAlt || 'icon'} width={24} height={24} className='ml-2' />
                        )}
                        <FormControl>
                            <DatePicker
                                selected={field.value}
                                onChange={(date) => field.onChange(date)}
                                dateFormat={dateFormat ?? 'MM/dd/yyyy'}
                                showTimeSelect={showTimeSelect ?? false}
                                timeInputLabel="Time:"
                                wrapperClassName="date-picker"
                            />
                        </FormControl>
                    </div>
                    {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
                </>
            );

        case FormFieldType.SKELETON:
            return (
                renderSkeleton ? renderSkeleton(field) : null
            )

        case FormFieldType.SELECT:
            return (
                <>
                    <FormControl className={`rounded-md border ${errorClass} bg-dark-400 [&:has(:focus)]:ring-2 [&:has(:focus)]:ring-primary-500 transition-all duration-300`}>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger className="shad-select-trigger w-full text-left p-1">
                                    <SelectValue placeholder={placeholder} />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent className="shad-select-content">
                                {props.children}
                            </SelectContent>
                        </Select>
                    </FormControl>
                    {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
                </>
            );

        case FormFieldType.TEXTAREA:
            return (
                <FormControl>
                    <>
                        <Textarea
                            placeholder={placeholder}
                            {...field}
                            className='shad-textarea'
                            disabled={props.disabled}
                        />
                        {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
                    </>
                </FormControl>
            );

        case FormFieldType.CHECKBOX:
            return (
                <FormControl>
                    <>
                        <div className='flex items-center gap-4'>
                            <Checkbox
                                id={props.name}
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                            <label htmlFor={props.name} className='checkbox-label'>{props.label}</label>
                        </div>
                        {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
                    </>
                </FormControl>
            );

        default:
            return null;
    }
};


// Type guard to check if an error is a FieldError
function isFieldError(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined
): error is FieldError {
    return error instanceof Object && 'type' in error;
}

const CustomFormField = (props: CustomProps) => {
    const { control, fieldType, name, label } = props;

    return (
        <FormField
            control={control}
            name={name}
            render={({ field, formState }) => (
                <FormItem className='flex-1'>
                    {fieldType !== FormFieldType.CHECKBOX && label && (
                        <FormLabel>{label}</FormLabel>
                    )}

                    <RenderField field={field} props={props} error={isFieldError(formState.errors[name]) ? formState.errors[name] as FieldError : undefined} />

                </FormItem>

            )}
        />
    )
}

export default CustomFormField
