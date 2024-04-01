import { Card, CardHeader, CardBody, Typography, Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

export default function HorizontalCard({ doctor }) {
  const  navigate = useNavigate()

    // Assuming doctor object has properties like doctor.full_name, doctor.specializations, doctor.experience, etc.
    const gotoViewDoctor = () =>{
      console.log(doctor.id);
      navigate(`/DoctorShow/ViewDocProfile/${doctor.id}`);

    }
    console.log(doctor.doctor_user.custom_id,'llllllllllllllllllllllllllllllllll');
    const gotoBookAppoiment = () =>{
      console.log(doctor.id);
      navigate(`/DoctorShow/BookAppoiment/${doctor.doctor_user.custom_id}`);

    }


    return (
        <Card className="w-full max-w-[48rem] flex-row h-[200px]">
            <CardHeader
                shadow={false}
                floated={false}
                className="m-0 w-2/5 shrink-0 rounded-r-none"
            >
                <img
                    src={doctor.profile_picture} // Assuming profile_picture is an ImageField and you have a way to access its URL
                    alt={`${doctor.first_name}'s Profile`}
                    className="h-full w-full object-cover mt-[10px]"
                />
            </CardHeader>
            <CardBody>
                <Typography variant="h4" color="gray" className="mb-1 uppercase">
                    {doctor.first_name} {doctor.last_name}
                </Typography>
                <Typography variant="h6" color="blue-gray" className="mb-1">
                    Specialization: {doctor.doctor_user.specializations}
                </Typography>
                <Typography variant=" h8" color="blue-gray" className="mb-1">
                    Education: {doctor.doctor_user.education} 
                </Typography>
                <Typography variant=" h8" color="blue-gray" className="mb-1 ">
                bookingFees : ₹{doctor.doctor_user.consultaion_fees} 
                </Typography>
                {/* Add more doctor information as needed */}
                <div className="flex justify-between">
                    <a className="inline-block">
                        <Button onClick={gotoBookAppoiment} variant="text" className="flex items-center bg-slate-300 gap-2">
                            Book Appointment
                            {/* Adjust the button as needed */}
                        </Button>
                    </a>
                    <a className="inline-block">
                        <Button onClick={gotoViewDoctor} variant="text" className="flex items-center bg-slate-300 gap-2">
                            View Profile
                         
                        </Button>
                    </a>
                </div>
            </CardBody>
        </Card>
    );
}
