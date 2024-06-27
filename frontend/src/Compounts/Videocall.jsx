import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useRef, useEffect } from 'react'; // Import useRef and useEffect
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import { baseUrl } from '../utils/constants/Constants';

// frontend\public\assets\catogory\videocall.jpg
const VideoCall = () => {

    let { roomId } = useParams();
    const containerRef = useRef(null);

    const trainsactionId = roomId
    const accessToken = localStorage.getItem("access");
    const decoded = jwtDecode(accessToken);
    const userID = decoded.user_id;
    const userName = decoded.first_name;
    const navigate = useNavigate();
      
 

  const handleLeaveRoom = async () => {
    try {
        

        // Use async/await to wait for the axios.patch request to complete
        const response = await axios.patch(`${baseUrl}appointment/update-order/${trainsactionId}/`);
        
        
        fetchTransactions(trainsactionId)
        // Navigate to the specified route after the update
        navigate(`/DoctorShow/BookAppoiment/booking-detailes`);
    } catch (error) {
        // Handle any errors that occur during the request
        console.error("Error updating status:", error);
        // Optionally, show an error message to the user
        toast.error("An error occurred while updating the status. Please try again later.");
    }
};


  // to fetch the data as per the search query
  const fetchTransactions = (trainsactionId) => {
    const accessToken = localStorage.getItem("access");
    
    axios
       .get(baseUrl + `appointment/geting/transaction/${trainsactionId}/`, {
         headers: {
           Authorization: `Bearer ${accessToken}`,
           Accept: "application/json",
           "Content-Type": "application/json",
         },
       })
       .then((req) => {
        
        // Directly access the transaction object
        const transaction = req.data;
        
    
        // Calculate commissions for the transaction
        const doctorCommission = transaction.amount * 0.8; // 80% of amount
        const adminCommission = transaction.amount * 0.2; // 20% of amount
    
        // Add commissions to the transaction object
        const transactionWithCommissions = {
            ...transaction,
            doctor_commission: doctorCommission,
            admin_commission: adminCommission,
        };
    
        
       
                   
           // Save commissions to the transactionCommission table
   // Assuming you have an endpoint to get or create commissions
   const commissionData = {
    transaction: transactionWithCommissions.transaction_id,
    doctor_commission: transactionWithCommissions.doctor_commission,
    admin_commission: transactionWithCommissions.admin_commission,
};
     axios.post(`${baseUrl}appointment/transactionCommission/`, commissionData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
     })   
       
         })
         .catch((err) => {
           
         });
     };
   
     

    useEffect(() => {
        const MyVideoCallMeet = async () => { 
            try {
                const appID = 39466302;
                const serverSecret = "42770b4c1014ae69eb3731bdf991bdcf";
                const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest( 
                    appID,
                    serverSecret,
                    roomId,
                    Date.now().toString(),
                    userName
                );
                
                
                const zp = ZegoUIKitPrebuilt.create(kitToken);
                
                
                zp.joinRoom({
                    container: containerRef.current,
                    scenario: {
                        mode: ZegoUIKitPrebuilt.OneONoneCall
                    },
                    turnOnCameraWhenJoining: true,
                    turnOnMicrophoneWhenJoining: true,
                    showPreJoinView: false,
                    onLeaveRoom: handleLeaveRoom
                });
            } catch (error) {
                console.error('Error generating kit token:', error);
            }
        }
        MyVideoCallMeet(); // Call MyVideoCallMeet with the ref element
    }, [roomId, userID, userName, navigate]);

    return (
        <>
            <div className="w-full h-full" ref={containerRef} />
     <div>
     <div className="flex flex-col items-center justify-center min-h-screen bg-cyan-900 dark:bg-gray-800">

<div className="w-full h-screen relative top-40">
<img
  src="/public/assets/catogory/videocall.jpg"

  className="w-full h-full object-cover absolute"
/>
</div>
</div>
     </div>
        </>
    );
}

export default VideoCall;