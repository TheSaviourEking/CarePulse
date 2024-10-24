import RegisterForm from '@/components/forms/RegisterForm'
import { getUser } from '@/lib/actions/patient.actions'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Register = async ({ params: { userId } }: SearchParamProps) => {
    const user = await getUser(userId)
    return (
        <div className="flex h-screen max-h-screen">
            <section className="remove-scrollbar container flex-1 flex-col py-10">
                <div className="sub-container max-w-[860px]">
                    <Image src={'/assets/icons/logo-full.svg'} alt="patient" height={1000} width={1000} className="mb-12 h-10 w-fit" />

                    <RegisterForm user={user} />
                    
                    <p className="justify-items-center text-dark-600 xl:text-left copyright py-12">&copy; 2024 CarePulse</p>
                </div>
            </section>

            <Image src={'/assets/images/register-img.png'} height={1000} width={1000} alt="doctors" className="side-img max-w-[390px]" />
        </div>
    )
}

export default Register
