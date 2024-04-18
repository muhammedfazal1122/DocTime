import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useRef, useEffect } from 'react'; // Import useRef and useEffect
import { jwtDecode } from "jwt-decode";

// frontend\public\assets\catogory\videocall.jpg
const DocVideoCall = () => {

    let { roomId } = useParams();
    const containerRef = useRef(null);



    
    const accessToken = localStorage.getItem("access");
    const decoded = jwtDecode(accessToken);
    const userID = decoded.user_id;
    const userName = decoded.first_name;
    const navigate = useNavigate();
      console.log(  userID,userName,'ppppppppp'
  );

   
    const handleLeaveRoom = () => {
        navigate(`/doctor/BookingDetailes`);
    }

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
                console.log(kitToken,'THIS IS KIT TOKEN');
                
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

export default DocVideoCall;