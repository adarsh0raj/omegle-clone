import { useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom"
import { Room } from "./Room";

export const Home = () => {
    const [name, setName] = useState('')
    const [localAudioTrack, setLocalAudioTrack] = useState<null | MediaStreamTrack>(null);
    const [localVideoTrack, setLocalVideoTrack] = useState<null | MediaStreamTrack>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [joined, setJoined] = useState(false);

    const getCam = async () => {
        const stream = await window.navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });
        const audioTrack = stream.getAudioTracks()[0];
        const videoTrack = stream.getVideoTracks()[0];
        setLocalAudioTrack(audioTrack);
        setLocalVideoTrack(videoTrack);
        if (!videoRef.current) return;
        videoRef.current!.srcObject = new MediaStream([videoTrack]);
        videoRef.current.play();
    }

    useEffect(() => {
        if (videoRef && videoRef.current) {
            getCam();
        }
    }, [videoRef]);

    if(!joined) {
        return (
            <>
                <div>
                    <video ref={videoRef}></video>
                </div>
                <div className="flex flex-column gap-4">
                    <span>Name: </span>
                    <input className="block rounded-md border-0 py-1 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" type="text" value={name} onChange={(e) => setName(e.target.value)}></input>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={() => setJoined(true)}
                    >
                        Join Room
                    </button>
                </div>
            </>
        )
    }

    return (
        <Room name={name} localAudioTrack={localAudioTrack} localVideoTrack={localVideoTrack} />
    )
}