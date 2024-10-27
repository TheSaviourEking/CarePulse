import { DOCTORS } from '@/constants';
import Image from 'next/image'
import Link from 'next/link'
import { formatDateTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { getAppointment } from '@/lib/actions/appoinment.actions';

const Success = async ({ params: { userId }, searchParams }: SearchParamProps) => {
    const appointmentId = searchParams?.appointmentId as string || '';
    const appointment = await getAppointment(appointmentId);
    const doctor = DOCTORS.find((doctor) => doctor.name === appointment.primaryPhysician);

    return (
        <div className='flex h-screen max-h-screen px-[5%]'>
            <div className="success-img">
                <Link href={'/'}>
                    <Image src={'/assets/icons/logo-full.svg'} height={1000} width={1000} alt='logo' className='h-10 w-fit' />
                </Link>

                <section className='flex flex-col items-center'>
                    <Image src={'/assets/gifs/success.gif'} height={300} width={280} alt='suceess' />
                    <h2 className='header mb-6 max-w-[600px] text-center'>
                        Your <span className='text-green-500'>appointmet request</span> has been successfully submitted!
                    </h2>
                    <p>We will be in touch shortly to confirm</p>
                </section>

                <section className='request-details'>
                    <p>Requested Appointment Details</p>
                    <div className='flex items-center gap-3'>
                        <Image src={doctor?.image!} height={100} width={100} alt='doctor' className='size-6' />
                        <p className='whitespace-nowrap'>Dr. {doctor?.name}</p>
                    </div>

                    <div className='flex gap-2'>
                        <Image src={'/assets/icons/calendar.svg'} height={24} width={24} alt='calendar' />
                        <p>{formatDateTime(appointment.schedule).dateTime}</p>
                    </div>
                </section>

                <Button variant={'outline'} className='shad-primary-btn' asChild>
                    <Link href={`/patients/${userId}/new-appointment`}>New Appointment</Link>
                </Button>

                <p className="copyright mt-10 py-12">&copy; 2024 CarePulse</p>
            </div>
        </div>
    )
}

export default Success